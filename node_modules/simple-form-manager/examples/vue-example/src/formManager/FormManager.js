export default function FormManager (formValidationSchema = {}) {
	var fieldNameArray = buildFieldNameArray(formValidationSchema);

	this.form = {
		isDirty: false,
		isValid: true,
		validator: formValidationSchema,
		ValidateValidator: () => {
			const schema = this.form.validator;
			fieldNameArray.forEach((fieldName) => {
				const fieldValidators = schema[fieldName];
				if (fieldValidators) {
					Object.keys(fieldValidators).forEach((e) => {
						const validatorProperties = fieldValidators[e];
						if (validatorProperties.isActive === undefined) {
							validatorProperties.isActive = true;
						}
					});
				}
			});
		}
	};

	this.form.ValidateValidator();
	this.fields = initializeFields(fieldNameArray);

	this.UpdateData = (data) => {
		const fieldName = data.name;

		this.fields[fieldName] = {
			...this.fields[fieldName],
			...data
		};

		this.ValidateField(fieldName, true);
	};

	this.ValidateForm = (initialIfDataIsBlank = false) => {
		fieldNameArray.forEach((fieldName) => {
			if (this.fields[fieldName].value === null && initialIfDataIsBlank) {
				this.fields[fieldName].value = "";
				this.fields[fieldName].originalValue = "";
			}
			this.ValidateField(fieldName, false);
		});

		this.UpdateFormStatus();
	};

	this.UpdateFormStatus = () => {
		let isValid = true;
		let isDirty = false;
		fieldNameArray.forEach((fieldName) => {
			if (!this.fields[fieldName].isValid) {
				isValid = false;
			}
			if (this.fields[fieldName].isDirty) {
				isDirty = true;
			}
		});
		this.form.isValid = isValid;
		this.form.isDirty = isDirty;
	};

	this.SetFormValidator = (validatorSchema) => {
		this.form.validator = validatorSchema;
	};

	this.SetFieldValidationStatus = (fieldName, value, errorMessage, overrideIfSame = false) => {
		const isSame = (this.fields[fieldName].isValid === value);
		if ((!isSame || (isSame && overrideIfSame)) && this.fields[fieldName].isValid) {
			this.fields[fieldName].isValid = value;
			this.fields[fieldName].errorMessage = errorMessage;
			this.UpdateFormStatus();
		}
	};

	this.ValidateField = (fieldName, updateFormStatus = true) => {
		const fieldValidators = this.form.validator[fieldName];
		let isValid = true;
		let errorMessage = "";
		if (fieldValidators) {
			Object.keys(fieldValidators).forEach((e) => {
				if (fieldValidators[e].validator) {
					if (fieldValidators[e].isActive) {
						const result = fieldValidators[e].validator(this.fields[fieldName].value);
						if (!result) {
							isValid = false;
							if (fieldValidators[e].errorMessage) {
								errorMessage = fieldValidators[e].errorMessage;
							}
						}
					}
				}
			});
		}

		this.fields[fieldName].isValid = isValid;
		this.fields[fieldName].errorMessage = errorMessage;

		if (updateFormStatus) {
			this.UpdateFormStatus();
		}
	};

	this.ToggleValidationNode = (fieldName, validator = undefined, value = undefined) => {
		const fieldValidators = this.form.validator[fieldName];
		if (fieldValidators) {
			Object.keys(fieldValidators).forEach((v) => {
				if (v === validator || !validator) {
					fieldValidators[v].isActive = (value === undefined) ? !fieldValidators[v].isActive : value;
				}
			});
		}
		//this.validateForm();
	};

	this.SetToClean = () => {
		fieldNameArray.forEach((fieldName) => {
			this.fields[fieldName].isDirty = false;
			this.fields[fieldName].touched = false;
			this.fields[fieldName].originalValue = this.fields[fieldName].value;
		});
		this.form.isDirty = false;
		this.form.touched = false;
	}

	function buildFieldNameArray (schema) {
		const fieldArray = [];
		Object.keys(schema).forEach((fieldName) => {
			fieldArray.push(fieldName);
		});
		return fieldArray;
	};

	function initializeFields (fieldArray) {
		let fields = {};
		fieldArray.forEach((fieldName) => {
			fields = {
				...fields,
				[fieldName]: {
					isDirty: false,
					touched: false,
					value: null,
					originalValue: null,
					isValid: true,
					errorMessage: ""
				}
			};
		});

		return fields;
	}
};
