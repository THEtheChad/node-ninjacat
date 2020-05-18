declare namespace Ninjacat {
	interface Advertiser {
		id: number;
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
		account_custom_field_values: Array<CustomFieldValues>;
	}

	interface ReportPending {
		status: 0;
		id: ReportID;
	}

	interface ReportRunning {
		status: 1;
		id: ReportID;
	}

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

	interface GReport {
		[key: string]: number;
	}

	type GenericReport = GReport & { dimensions: object };

	interface ReportReady {
		status: 2;
		id: ReportID;
		data: Array<Report<GenericReport>>;
	}

	type ReportResponse = ReportPending | ReportRunning | ReportReady;

	interface CustomFieldValues {
		[key: string]: number;
	}

	type AgencyID = number;
	type ReportID = number;
	type TemplateID = number;
	type AdvertiserID = number;
}