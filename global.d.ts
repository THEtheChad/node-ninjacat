declare module 'JSONStream';

declare namespace Ninjacat {
	interface CustomField {
		id: number;
		name: string;
	}

	interface CustomFieldValue {
		id: number;
		custom_field_id: number;
		name: string;
		advertiserIds: number[];
	}

	type AgencyID = number;
	type ReportID = number;
	type TemplateID = number;
	type AdvertiserID = number;

	interface Advertiser {
		id: AdvertiserID;
		name: string;
		phone?: string;
		company: string;
		email: string;
		website: string;
		external_id: string;
		phone_conv_period: number;
		phone_conv_threshold: number;
		owner_id?: number;
		date_format: number;
		digit_format: number;
		timezone: string;
		currency_pre_format: string;
		currency_post_format: string;
		ninjatrack_email?: string;
		only_conv_notify: number;
		anonymize_callers: number;
		budget: number;
		budget_warning: number;
		budget_critical: number;
		facebook_campaigns: string;
		tools_keyword_filter: string;
		use_phone_mappings: number;
		custom_field?: string;
		account_custom_field_values: Array<CustomFieldValue>;
	}

	type Response = { error: string } | { [key: string]: any };

	namespace Report {
		interface GReport {
			[key: string]: number;
		}

		type Generic = GReport & {
			dimensions: object;
		};

		interface Report<T> {
			success: boolean;
			id: ReportID;
			title: string;
			dataRows: {
				rows: Array<T>;
				totals: Array<T>;
				dataSampled: boolean;
			};
			errors: {
				[key: string]: {
					type: string;
					msg: string;
					devMsg: string;
					userMsg: string;
					error: string;
					info: Array<any>;
					widgetArchiveId: number;
					widgetId: number;
					exceptionMessages: Array<any>;
				};
			};
		}

		interface Pending {
			status: 0;
			id: ReportID;
		}

		interface Running {
			status: 1;
			id: ReportID;
		}

		interface Ready {
			status: 2;
			id: ReportID;
			data: Array<Report<Generic>>;
		}

		interface Error {
			error_message: string;
		}

		type Response = Pending | Running | Ready | Error;
	}
}
