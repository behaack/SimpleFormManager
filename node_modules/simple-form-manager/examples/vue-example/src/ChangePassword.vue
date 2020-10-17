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
    import FM from "./formManager/FormManager";

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

    function minLength(max) {
        return function (value) {
            return value.length >= max;
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