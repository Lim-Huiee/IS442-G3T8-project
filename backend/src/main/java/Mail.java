import com.mailersend.sdk.emails.Email;

import java.util.ArrayList;
import java.util.HashMap;

import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.Recipient;
import com.mailersend.sdk.exceptions.MailerSendException;

public class Mail {

	public static void sendEmail(int orderId, String username, double total_paid, String orderDatetime, ArrayList<HashMap<String, String>> purchase, String userMail){
        Email email = new Email();

        email.setFrom("Ticket Mistress", "info@trial-v69oxl5yyrx4785k.mlsender.net");

        // Recipient recipient = new Recipient("test", "mistressticket@gmail.com");
        Recipient recipient = new Recipient("test", userMail);
        email.AddRecipient(recipient);
        
        email.setSubject("Your Purchase is Successful!");
    
        MailerSend ms = new MailerSend();
    
        ms.setToken("mlsn.295ce4f2e416a4b81b047d8996312099a2f19dab6b1d3fe9def73d66fd34bd7f");
    
        email.setTemplateId("pq3enl6nxrm42vwr");

        email.addPersonalization(recipient, "orderId", orderId);
        
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

    public static int sendTicketsEmail(int orderID, String username, ArrayList<HashMap<String, String>> eventTickets, String userMail) {
        
        Email email = new Email();

        email.setFrom("Ticket Mistress", "info@trial-v69oxl5yyrx4785k.mlsender.net");

        // Recipient recipient = new Recipient("test", "mistressticket@gmail.com");
        Recipient recipient = new Recipient("test", userMail);
        email.AddRecipient(recipient);
        
        email.setSubject("Your Purchase is Successful!");
    
        MailerSend ms = new MailerSend();
    
        ms.setToken("mlsn.295ce4f2e416a4b81b047d8996312099a2f19dab6b1d3fe9def73d66fd34bd7f");

        // to add info
        email.setTemplateId("0r83ql3x2dvlzw1j");

        email.addPersonalization(recipient, "orderID", orderID);
        email.addPersonalization(recipient, "username", username);
        email.addPersonalization(recipient, "eventTickets", eventTickets);

        try {
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
            if (response.responseStatusCode == 200 || response.responseStatusCode == 202) {
                return 1;
            }
        } catch (MailerSendException e) {
            e.printStackTrace();
        }
        return -1;
    }
}
