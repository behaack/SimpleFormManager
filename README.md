# FormManager

FormManager is a javascript class you can use to manage your html forms.  It can be used with Angular, React, Vue or any other javascript library for framework. It is also built to be unopinionated about what UI components you use. Use it with plain old html controls or use it with any one of the dozens of UI components available to you.

A word of warning upfront though.  For this tool to work it will require you to wrap all of your UI components to they provide a standard, but simple interface for FormManager to work with.  If you have an application are creating a lot of forms this tool will save you a ton of work and make your forms extremely easy to manage. For applications with only a few forms, the effort to wrap your forms is likely not worth the effort so this tool is probably not appropriate for your project. 

Here is a quick example for a change password form:

Step 1: Wrap a textbox control so it can work with FormManager. We will use Vue Js in this example:

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



Step 2: Create your form, again we will use Vue Js:

change-password.vue

    <template>
        <form>
            <MyTextbox
                ref="password"
                :name="password"
                v-model.trim="formData.password"
                @dataChange="onDataChange"
            />

            <MyTextbox
                ref="newPassword"
                :name="newPassword"
                v-model.trim="formData.newPassword"
                @dataChange="onDataChange"
            />

            <MyTextbox
                ref="confirmPassword"
                :name="confirmPassword"
                v-model.trim="formData.confirmPassword"
                @dataChange="onDataChange"
            />


        </form>

    </template>

    <script>
        import MyTextbox from "./myTextbox";
        import FM from "FormManager";

        const fields = {
   	        password: {
                required: {
                    validator: required,
                    errorMessage: "Password is required"
                }
            },
            newPassword: {
   	            required: {
		            validator: required,
		            errorMessage: "New password is required"
                },
                minLength: {
		            validator: minLength(8),
                    errorMessage: "Password must be 10 characters in length and contain at least on special character"
                }
            },
            confirmPassword: {
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

        export default {
            name: "change-password",
            components: {
                MyTextbox
            },
            data () {
                return {
                    fm: new FM(fields),
                    formData: {
                        password,
                        newPassword,
                        confirmPassword
                    }
                };
            },
            mounted () {
                this.initializeValues();
            },            
            methods () {
                onDataChange (data) {
                },
                initializeValues () {
                    this.$refs.password.initializeValue("");
                    this.$refs.newPassword.initializeValue("");
                    this.$refs.confirmPassword.initializeValue("");
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