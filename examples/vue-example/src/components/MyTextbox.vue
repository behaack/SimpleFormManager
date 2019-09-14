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