export function uint8ArrayToBase64Url(uint8Array, start, end) {
	start = start || 0;
	end = end || uint8Array.byteLength;

	const base64 = window.btoa(
		String.fromCharCode.apply(null, uint8Array.subarray(start, end)));
	return base64
		.replace(/\=/g, '') // eslint-disable-line no-useless-escape
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}