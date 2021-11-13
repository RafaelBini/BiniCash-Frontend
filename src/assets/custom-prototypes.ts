export { } // this will make it module

String.prototype.toNormalized = function () {


    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


}
