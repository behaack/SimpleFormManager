# FormManager

FormManager is a javascript class you can use to manage your html forms.  It can be used with Angular, React, Vue or any other javascript library for framework. It is also built to be unopinionated about what UI components you use. Use it with plain old html controls or use it with any one of the dozens of UI components available to you.

A word of warning upfront though.  For this tool to work it will require you to wrap all of your UI components to they provide a standard, but simple interface for FormManager to work with.  If you have an application are creating a lot of forms this tool will save you a ton of work and make your forms extremely easy to manage. For applications with only a few forms, the effort to wrap your forms is likely not worth the effort so this tool is probably not appropriate for your project. 

FormManager, when instantiated, requires a json object with the following format:

        const fields = {
   	        fieldname1: {
                validator1: {
                    validator: validatorFunction,
                    errorMessage: "This is the error message when validator return false"
                }
            },
            fieldsName2: {
                etc...
            }
        }

When FormManager is instantiated is generates an internal object with the following format:

    {
        form": {
            "isDirty": false,
            "isValid": false,
            "validator": {
                "fieldname1": {
                    "validator1": {
                        "errorMessage": "This is the error message when validator return false",
                        "isActive": true
                    }
                }
            }
        },
        "fields": {
            "fieldname1": {
                "isDirty": false,
                "touched": false,
                "value": "",
                "originalValue": "",
                "isValid": false,
                "errorMessage": "This is the error message when validator return false",
                "name": "fieldname1"
            },
        }
    }

The values of this object are managed by FormManager and are available to the developer to manage his/her application.

## Available methods:

### UpdateData

##### Description

Used to update form manager as the data in the form changes.

##### Usage

UpdateData(fieldDataObject)

fieldsDataObject:

    {
        name: [string: name of field],
        touched: [boolean],
        isDirty: [boolean],
        value: [value],
        originalValue: [orginalinal value]        
    }

This object will typically be generated and emitted by the ui object. The 'name' field in the object must match the name of the field provided to FormManager upon instantiation.

When UpdateData is called, it updates the FormManager form object and validates revalidated the form.

### ToggleValidationNode

##### Description

Frequently, validation rules change depending on the state of a form. FormManager can handle changinf validation rules. When you instantiate FormManager include all of the validation rules the form might encounter.  You can then toggle those rules on and off using ToggleValidationNode as the situation dictates. 

##### Usage

    ToggleValidationNode(fieldName, validatorName, value)

Example: 
 
    ToggleValidationNode("fieldName1", "validator1", false)

This call turns off validator1 for field fieldName1.

### SetFieldValidationStatus

##### Description

SetFieldValidationStatus provides the ability to programmatically override the validation status of a field and set the error message. This method is typically used in situations where a rule involves multiple fields. A classic examples is a form requiring the user to change his/her password. Usually this involves entering a password in one field and then retyping the same password into a different field. A validation rules is created to confirm that the same value was typed into both fields. 

SetFieldValidationStatus is designed for just such a situation.

##### Usage

    SetFieldValidationStatus(fieldName, value, errorMessage)

Example:

    SetFieldValidationStatus("fieldName1", false, "Passwords do not match")

This call sets fieldName1 to invalid and sets the errorMessage to "Passwords do not match". The form's isValid status is also set to false, since one invalid field makes the form invalid.

### SetToClean

##### Description

This method resets the 'isDirty' and 'touched' status for each field in the form to false.  It also resets the originalValue of each field to the current value. Finally, it resets the forms value 'isDirty' to false.

##### Usage

    SetToClean()


Here is a quick example for a change password form:

Step 1: Wrap a textbox control so it can work with FormManager. We will use Vue Js in this example:

MyTextbox.vue

    <template>
        <input
            :name="name"
            :value="value"
            type="text"
            @blur="onBlur"
            @input="onUpdate"
        />
    </template>

    <script>
        export default {
            name: "my-textbox",
            props: {
                name: {
                    type: String,
                    required: true
                },
                value: {
                    required: true,
                    default: "" 
                }
            },
            data () {
                return {
                    originalValue: "",
                    touched: false,
                    val: ""
                };
            },
            computed: {
                isDirty () {
                    return (this.originalValue !== this.val);
                }
            },
            methods: {
                onUpdate(e) {
                    this.val = e.target.value;
                    this.$emit("input", this.val);
                    this.controlChanged();
                },
                onBlur () {
                    this.touched = true;
                    this.controlChanged();
                },
                controlChanged () {
                    const controlData = {
                        name: this.name,
                        touched: this.touched,
                        isDirty: this.isDirty,
                        value: this.val,
                        originalValue: this.originalValue
                    };
                    this.$emit("dataChange", controlData);
                },
                initializeValue (value) {
                    this.val = value;
                    this.originalValue = value;
                    this.controlChanged();
                }
            }
        }
    </script>

Step 2: Create your form, again we will use Vue Js:

ChangePassword.vue

    <template>
        <form @submit.prevent="onSubmit">
            <div>
                <MyTextbox
                    ref="password"
                    name="password"
                    v-model.trim="formData.password"
                    @dataChange="onDataChange"
                />
                <div v-if="(!fm.fields.password.isValid && fm.fields.password.touched)">{{ fm.fields.password.errorMessage }}</div>
            </div>

            <div>
                <MyTextbox
                    ref="newPassword"
                    name="newPassword"
                    v-model.trim="formData.newPassword"
                    @dataChange="onDataChange"
                />
                <div v-if="(!fm.fields.newPassword.isValid && fm.fields.newPassword.touched)">{{ fm.fields.newPassword.errorMessage }}</div>            
            </div>

            <div>
                <MyTextbox
                    ref="confirmPassword"
                    name="confirmPassword"
                    v-model.trim="formData.confirmPassword"
                    @dataChange="onDataChange"
                />
                <div v-if="(!fm.fields.confirmPassword.isValid && fm.fields.confirmPassword.touched)">{{ fm.fields.confirmPassword.errorMessage }}</div>            
            </div>

            <button 
                type="submit"
                :disabled="!(fm.form.isDirty && fm.form.isValid)"
            >
                Submit Change
            </button>
            <pre>{{ fm }}</pre>
        </form>
    </template>

    <script>
        import MyTextbox from "./components/MyTextbox";
        import FM from "./formManager/FormManager"; //"FormManager";

        const fields = {
            password: {
                required: {
                    validator: required,
                    errorMessage: "Password is required"
                }
            },
            newPassword: {
                minLength: {
                    validator: minLength(10),
                    errorMessage: "Password must be greater than 10 characters"
                }
            },
            confirmPassword: {
                required: {
                    validator: required,
                    errorMessage: "Confirmation password is required"
                }
            }
        }
        
        function required(val) {
            return (!!val);
        }

        function minLength(min) {
            return function (value) {
                return value.length >= min;
            }
        }

        export default {
            name: "change-password",
            components: {
                MyTextbox
            },
            data () {
                return {
                    fm: new FM(fields),
                    formData: {
                        password: "",
                        newPassword: "",
                        confirmPassword: ""
                    }
                };
            },
            mounted () {
                this.initializeValues();            
            },            
            methods: {
                onDataChange (data) {
                    this.fm.UpdateData(data);
                    this.customConfirmPasswordValidation();
                },
                customConfirmPasswordValidation () {
                    const isMatch = (this.formData.newPassword === this.formData.confirmPassword);                 
                    this.fm.SetFieldValidationStatus("confirmPassword", isMatch, "New password and confirmation password do not match");
                },
                initializeValues () {
                    this.$refs.password.initializeValue("");
                    this.$refs.newPassword.initializeValue("");
                    this.$refs.confirmPassword.initializeValue("");
                },
                onSubmit() {
                    console.log(this.formData);
                }
            }
        }
    </script>

#### Explaination

The key parts of this code are:

The wrapped html <input /> control in step #1 implements the following methods:

1) We tap into the input changes with @input="onUpdate". When the user makes changes to the control, onUpdate is invoked.

2) onUpdate $emits the new value (for two way data binding), this is managed differently in react js.

3) Then conteolChanges is called. controlChanged $emits an object that is consumed by the form via a call to DataForm's UpdateData method. 

4) A method called initializeValue is created to initialize the values of the field in FormManager. Notice that initializeValue set the variables val and originalValue. it also calls controlChanged which emits the intial values for FormManager.

In the form we see the following:

1) A *fields* object is created for each field in the form. This json object is used to define the fields and validation rules. This is then used in the instantiation of the FieldManager object in the following line of code:
    fm: new FM(fields)

2) Each html control is created using the following pattern:

        <MyTextbox
            ref="password"
            name="password"
            v-model.trim="formData.password"
            @dataChange="onDataChange"
        />

    the ref is used to invoke the *intializeValue* method of the control. The *name* property *must* be the same as the field name inthe FormManager form object. The *dataChange* event property is used to feed data from the controller to FormManager.

3) The *onDataChange* method makes one critical call: 

        this.fm.UpdateData(data);

    *data* is the data package created by the *onControlChanges* method of our custom controller *myTextBox*.

    Calling *UpdateData* caused the FormManager to get updated with the new data.

    The call to *customConfirmPasswordValidation* is to implement a validation rule to make sure the new password is equal to the confirmation password. Note the call to *SetFieldValidationStatus*.

4) *initializeValues* calls each control in the form. And via *onDataChange* each field in the FieldManager object is also intialized.
   
5) Note how FormManager is used to hide/show the error messages:

        v-if="(!fm.fields.newPassword.isValid && fm.fields.newPassword.touched)

    And is used to enable/disable the submit button:

        :disabled="!(fm.form.isDirty && fm.form.isValid)"


