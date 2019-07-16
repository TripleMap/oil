export class GeojsonValidationError extends Error {
    error: any;
    constructor(error) {
        super();
        this.error = error;
    }
}