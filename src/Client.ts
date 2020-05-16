import Request from 'request';
import jwt from 'jsonwebtoken';
// @ts-ignore
import JSONStream from 'JSONStream';

interface NinjacatClientOpts {
	client_id: string;
	client_secret: string;
	agency_id: number | string;
	agency_identifier: string;
	report_secret: string;
}

type RequestID = number;

export default class NinjacatClient {
	client_id: string;
	client_secret: string;
	agency_id: number;
	agency_identifier: string;
	report_secret: string;
	ready: Promise<any> | null = null;
	report: {
		post: (
			template_id: Ninjacat.TemplateID,
			advertiser_id: Ninjacat.AdvertiserID,
			opts?: {
				start_date: string;
				end_date: string;
			},
		) => Promise<{ request_id: number }>;
		get: (request_id: RequestID) => Promise<Ninjacat.ReportResponse>;
	};
	request: Request.RequestAPI<
		Request.Request,
		Request.CoreOptions,
		Request.RequiredUriUrl
	>;

	static base_url = 'https://api.ninjacat.io';

	constructor(opts: NinjacatClientOpts) {
		this.client_id = opts.client_id;
		this.client_secret = opts.client_secret;
		this.agency_id = Number(opts.agency_id);
		this.agency_identifier = opts.agency_identifier;
		this.report_secret = opts.report_secret;

		this.request = Request.defaults({
			json: true,
			baseUrl: NinjacatClient.base_url,
			headers: {
				'Client-Id': this.client_id,
				Accept: 'application/json',
				'x-api-key': this.agency_identifier,
			},
		});

		this.report = {
			get: (request_id) => {
				const path = ['open_api/report', this.agency_id, request_id].join('/');

				const payload = {
					agency_id: this.agency_id,
					request_id,
				};

				const token = jwt.sign(payload, this.report_secret);
				const config: any = {
					json: true,
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				};

				return new Promise((resolve, reject) => {
					Request.get(
						`https://app.ninjacat.io/${path}`,
						config,
						function processReportGet(err, _res, body) {
							if (err) {
								reject(err);
								return;
							}
							resolve(body);
						},
					);
				});
			},
			post: (template_id, advertiser_id, opts) => {
				const path = [
					'open_api/report',
					this.agency_id,
					template_id,
					advertiser_id,
				].join('/');

				const payload = {
					agency_id: this.agency_id,
					template_id,
					advertiser_id,
				};

				const token = jwt.sign(payload, this.report_secret);
				const config: any = {
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				};

				if (opts) {
					config.form = opts;
				}

				return new Promise((resolve, reject) => {
					Request.post(
						`https://app.ninjacat.io/${path}`,
						config,
						function processReportPost(err, _res, body) {
							if (err) {
								reject(err);
								return;
							}
							resolve(body);
						},
					);
				});
			},
		};
	}

	auth() {
		if (!this.ready) {
			const basic = Buffer.from(
				this.client_id + ':' + this.client_secret,
			).toString('base64');

			this.ready = new Promise((resolve, reject) => {
				this.request.post(
					'/oauth2/token',
					{
						headers: {
							'Cache-Control': 'no-cache',
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: `Basic ${basic}`,
						},
					},
					(err, _res, body) => {
						if (err) {
							reject(err);
							return;
						}

						this.request = this.request.defaults({
							headers: {
								Authorization: `Bearer ${body.access_token}`,
								'Content-Type': 'application/json',
							},
						});
						resolve();
					},
				);
			});
		}

		return this.ready;
	}

	async advertisers(): Promise<Array<Ninjacat.Advertiser>> {
		await this.auth();

		return new Promise((resolve, reject) => {
			this.request
				.get('/management_open_api/advertisers')
				.on('error', (err: Error) => reject(err))
				// @ts-ignore
				.pipe(JSONStream.parse())
				.on('data', (d: any) => resolve(d));
		});
	}
}
