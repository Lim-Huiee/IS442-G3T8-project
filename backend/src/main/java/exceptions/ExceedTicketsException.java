package exceptions;

public class ExceedTicketsException extends Exception {
    public ExceedTicketsException(String message) {
        super(message);
    }
}
