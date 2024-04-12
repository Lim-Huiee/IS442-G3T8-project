package exceptions;

public class InsufficientTicketsException extends Exception {
    public InsufficientTicketsException(String message) {
        super(message);
    }
}
