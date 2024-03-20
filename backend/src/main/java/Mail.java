import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.exceptions.MailerSendException;

public class Mail {
	public static void sendEmail(){
        Email email = new Email();

        email.setFrom("Ticket Mistress", "info@trial-pq3enl6yj05g2vwr.mlsender.net");
        email.addRecipient("test", "mistressticket@gmail.com");
        
        email.setSubject("Email subject");
    
        email.setPlain("This is the text content");
        email.setHtml("<p>This is the HTML content</p>");
    
        MailerSend ms = new MailerSend();
    
        ms.setToken("mlsn.c7e50d74154a793566ba9f6286c4dd69f76eb8e8cb08e09685678380c98fd7e2");
    
        try {
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
        } catch (MailerSendException e) {
    
            e.printStackTrace();
        }
	}
}
