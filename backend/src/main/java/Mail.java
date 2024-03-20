import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.Recipient;
import com.mailersend.sdk.exceptions.MailerSendException;

public class Mail {
	public static void sendEmail(){
        Email email = new Email();

        email.setFrom("Ticket Mistress", "info@trial-pq3enl6yj05g2vwr.mlsender.net");

        Recipient recipient = new Recipient("test", "mistressticket@gmail.com");
        email.AddRecipient(recipient);
        
        email.setSubject("Your Purchase is Successful!");
    
        MailerSend ms = new MailerSend();
    
        ms.setToken("mlsn.c7e50d74154a793566ba9f6286c4dd69f76eb8e8cb08e09685678380c98fd7e2");
    
        email.setTemplateId("3z0vklo71reg7qrx");

        email.addPersonalization(recipient, "price", "");
        email.addPersonalization(recipient, "orderId", "");
        email.addPersonalization(recipient, "quantity", "");
        email.addPersonalization(recipient, "username", "");
        email.addPersonalization(recipient, "eventName", "");
        email.addPersonalization(recipient, "eventVenue", "");
        email.addPersonalization(recipient, "total_paid", "");
        email.addPersonalization(recipient, "account_name", "");
        email.addPersonalization(recipient, "eventDatetime", "");
        email.addPersonalization(recipient, "orderDatetime", "");

        try {
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
        } catch (MailerSendException e) {
            e.printStackTrace();
        }
	}
}
