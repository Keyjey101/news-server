class ApiError extends Error {

  //расширяем класс еррор для простого выбрасывания ошибки с кодом с помощью статик методов
    constructor(status, message) {
      super();
      this.status = status;
      this.message = message;
    }
  
    static badRequest(message) {
      return new ApiError(404, message);
    }
  
    static forbidden(message) {
      return new ApiError(403, message);
    }
  
    static internal(message) {
      return new ApiError(500, message);
    }
    
  }
  
  module.exports = ApiError;