import { ref, withParams } from "./common";
export default (equalTo) =>
	withParams({ type: "sameAs", eq: equalTo }, (value, parentVm) => {
		return value === ref(equalTo, this, parentVm);
	});
