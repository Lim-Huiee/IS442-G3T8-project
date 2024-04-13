package exceptions;
import spark.ExceptionHandler;
import spark.Request;
import spark.Response;

public class MyExceptionHandler implements ExceptionHandler<ExceedTicketsException> {
    @Override
    public void handle(ExceedTicketsException exception, Request request, Response response) {
        response.status(400); // Set HTTP status code to indicate a bad request
        response.type("application/json"); // Set response type to JSON

        // Create a JSON object containing the error message
        String errorMessage = "{\"message\": \"" + exception.getMessage() + "\"}";

        // Send the error message as the response body
        response.body(errorMessage);
    }
}