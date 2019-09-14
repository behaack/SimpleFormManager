# FormManager

FormManager is a javascript class you can use to manage your html forms.  It can be used with Angular, React, Vue or any other javascript library for framework. It is also built to be unopinionated about what UI components you use. Use it with plain old html controls or use it with any one of the dozens of UI components available to you.

A word of warning upfront though.  For this tool to work it will require you to wrap all of your UI components to they provide a standard, but simple interface for FormManager to work with.

Here is a quick example for a change password form:

Step 1: create an json object for your form:

    const fields = {
	    password: {
            required: {
                validator: required,
                errorMessage: "Password is required"
            }
        },
        newpassword: {
   	        required: {
		        validator: required,
		        errorMessage: "New password is required"
            },
            minLength: {
		        validator: minLength(8),
                errorMessage: "Password must be 10 characters in length and contain at least on special character"
            }
        },
        confirmpassword: {
            required: {
                validator: required,
                errorMessage: "error.auth.missingConfirmationPassword"
            },
            matchPassword: {
                validator: null,
                errorMessage: "Confirmation password must match password"
            }
        }
    }

Step 2: Wrap a textbox control so it can work with FormManager. We will use Vue Js in this example:

myTextbox.vue

    <template>
        <input
            :name="name"
            :value="value"
            @blur="blur"
            @input="onUpdate"
        />
    </template>

    <script>
        export default {
            name: "my-textbox"
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
            methods () {
                onUpdate(e) {
                    this.val = e......;
                    this.controlChanged();
                },
                onBlur () {
                    this.touched = true;
                    this.controlChanged();
                },
                onControlDataChanged () {
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
                    this.onUpdate(value);
                }
            }
        }
    </script>









```sh
$ cd dillinger
$ npm install -d
$ node app
```

 - Write MORE Tests
 - Add Night Mode