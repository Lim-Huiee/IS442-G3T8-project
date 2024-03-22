import com.mailersend.sdk.emails.Email;

import java.util.ArrayList;
import java.util.HashMap;

import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.Recipient;
import com.mailersend.sdk.exceptions.MailerSendException;

public class Mail {

	public static void sendEmail(int orderId, String username, double total_paid, String orderDatetime, ArrayList<HashMap<String, String>> purchase){
        Email email = new Email();

        email.setFrom("Ticket Mistress", "info@trial-pq3enl6yj05g2vwr.mlsender.net");

        Recipient recipient = new Recipient("test", "mistressticket@gmail.com");
        email.AddRecipient(recipient);
        
        email.setSubject("Your Purchase is Successful!");
    
        MailerSend ms = new MailerSend();
    
        ms.setToken("mlsn.c7e50d74154a793566ba9f6286c4dd69f76eb8e8cb08e09685678380c98fd7e2");
    
        email.setTemplateId("z3m5jgrnwk0ldpyo");

        email.addPersonalization(recipient, "orderId", orderId);
        
        // Purchase purchase = new Purchase();
        // purchase.0.price = "";
        // purchase.0.quantity = "";
        // purchase.0.eventName = "";
        // purchase.0.eventDetails = "";
        // for (int i=0; i<purchase.size(); i++) {
        //     email.addPersonalization(recipient, "Purchase", purchase[i]);
        // }
        email.addPersonalization(recipient, "Purchase", purchase);
    
        email.addPersonalization(recipient, "username", username);
        email.addPersonalization(recipient, "total_paid", total_paid);
        email.addPersonalization(recipient, "account_name", username);
        email.addPersonalization(recipient, "orderDatetime", orderDatetime);

        try {
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
        } catch (MailerSendException e) {
            e.printStackTrace();
        }
	}
}
