import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import spark.Filter;
import spark.Request;
import spark.Response;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter; // Import the missing classes
/* import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException; */

import static spark.Spark.*;

public class Main {

// Define CORS filter as a nested static class
public static class CorsFilter {
    public static void addCorsHeaders(Request request, Response response) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.header("Access-Control-Allow-Credentials", "true");
    }
}


public static class LocalDateTimeTypeAdapter extends TypeAdapter<LocalDateTime> {
    @Override
    public void write(JsonWriter out, LocalDateTime value) throws IOException {
        out.value(value.toString()); // Serialize LocalDateTime to a string
    }

    @Override
    public LocalDateTime read(JsonReader in) throws IOException {
        return LocalDateTime.parse(in.nextString()); // Deserialize string to LocalDateTime
    }
}

public static void main(String[] args) {
    // Register custom TypeAdapter for LocalDateTime with Gson
    Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeTypeAdapter())
            .create();


        /// ==================== Testing of User/TicketOfficer class =======================================
         
        System.out.println("=============================Start OF TESTING FOR USER CLASS====================");
        try {
            // Usage example: retrieve user with ID 1
            User user = User.getUserByID(1);
            User customer = null;

            if (user != null) {
                System.out.println(user.toString());    // prints object
                customer = User.login("user 2","password2");        //customer login, returns object
                System.out.println(User.login("user 1","password2"));            // login fail, returns null because login() returns object

                System.out.println(User.login("ticket man","password5"));     // ticket officer  login, returns user object
                System.out.println(User.register("Dehou","pwpwpw","Dehou@gmail.com"));  // Register successfully if u run the first time. Else, username exists
                System.out.println(User.register("Dehouhehexd","asd","haha"));           // invalid email

                if(customer instanceof Customer){
                    Customer c = (Customer) customer;
                    System.out.println(c.getAmountAvail());          // class cast, testing getAmountAvail() for customer 
            }
                
            } else {
                System.out.println("User not found.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("=============================END OF TESTING FOR USER CLASS====================");

        System.out.println("=============================START OF TESTING FOR EVENT MANAGER CLASS===========");
        User eventManager = null;
        try {
            eventManager=User.login("em@tm.com","password4");     // event manager login, returns user object

            if (eventManager != null){
                if(eventManager instanceof EventManager){
                    EventManager em = (EventManager) eventManager;
                    String eventType = "Concert";
                    String eventName = "Taylor Swift Concert";
                    String venue = "National Stadium";
                    LocalDateTime eventDateTime = LocalDateTime.of(2024, 12, 31, 20, 0); // Example datetime
                    int numTotalTickets = 1000;
                    int numTicketsAvailable = 1000;
                    String eventDetails = "A typical  Event";
                    int ticketPrice = 90;
                    String result = em.createEvent(eventType, eventName, venue, eventDateTime, numTotalTickets, numTicketsAvailable,eventDetails,ticketPrice);          
                    System.out.println(result);            //creates new event in DB, will print "event exists" if you run it a 2nd time

                    // update taylor swift event
                    String updateResult = em.updateEvent(5, eventType,eventName, "my house", eventDateTime, numTotalTickets, 998, eventDetails, ticketPrice);
                    System.out.println(updateResult);
                  
                    /* // delete taylor swift event      ==================== uncomment this part to test delete =============
                    String deleteResult = em.deleteEvent(5);
                    System.out.println(deleteResult);  */

                    //======================================= event manager adding ticket officer============================
                    String addTicketingOfficerResult = em.addTicketingOfficer("Jeremy", "123", "jeremy@hotmail.com");
                    System.out.println(addTicketingOfficerResult);

                    // view sale statistics test, output is in readable format for testing, will amend output next time
                    System.out.println(em.viewSaleStatistics());
                }
            }

//update event parameters: int eventID, String eventName, String venue, LocalDateTime dateTime, int numTotalTickets, int numTicketsAvailable, String eventDetails, int ticketPrice

            if (eventManager instanceof EventManager){   // FOR TESTING ONLY/ can change to check instanceof Customer, it won't print "pass". 
                System.out.println("pass");            //Verifies access control, means customer wont access eventManager etc
            }
            
        } catch (Exception e){
            e.printStackTrace();
        }
        System.out.println("=============================END OF TESTING FOR EVENT MANAGER CLASS===========");
        // =========================== END TESTING OF EVENT MANAGER CLASS====================


        // =============================START OF TESTING FOR EVENT CLASS=========================================

        System.out.println("=============================START OF TESTING FOR EVENT CLASS================");
        Event testEvent =  Event.getEventByID(4);
        System.out.println(testEvent);
        System.out.println(testEvent.getEventID());
        

        System.out.println("------ Start of testing get Alll bookable events-------");
         ArrayList<Event> allEvents= Event.getAllBookableEvents();
        for (Event event:allEvents){
            System.out.println(event.getEventName());
            System.out.println("Number of tickets sold is " + event.numTicketsSold());
            System.out.println("Revenue is " + event.revenueEarned()+ "\n");
        }

        System.out.println("------ Start of testing get upcoming bookable events-------");
        ArrayList<Event> upcomingEvents = Event.getUpcomingEvents();
        for (Event event:upcomingEvents){
            System.out.println(event.getEventName());
        }
    
        // ==============================END  TESTING FOR EVENT CLASS =========================================

        System.out.println("-----------------------------------TEST CHECKOUT ORDER------------------------");
        Map<Integer, Integer[]> eventsBooked = new HashMap<>();  // event id, [num tix purchased, not used]
        eventsBooked.put(1, new Integer[]{1, 2});
        eventsBooked.put(2, new Integer[]{2, 3});

        // Booking for User id 1
        // Consists of :
        // Event id 1, 1 ticket, 2 accompanying guest
        // Event id 2, 2 tickets, 3 accompanying guest
        Integer newOrderIDCreated = Order.createOrder(1); // creates a new order id
        System.out.println(newOrderIDCreated);

        Order.checkOutOrder(eventsBooked, newOrderIDCreated);

        ArrayList<Order> orders = Order.getAllOrdersByUserID(1);
        for (Order o : orders) {
            if (o.getOrderID() == newOrderIDCreated) { // return latest order only
                System.out.println(o.getTotalPrice());
            }
        }
       
        System.out.println("------------------------------End Testing of CHECKOUT ORDER------------------------");


        System.out.println("---------------------------SPARK ROUTING TEST------------------------------");
        // Set up Spark server on port 4567
        port(4567);

        // Register CORS filter
        before("*", (request, response) -> CorsFilter.addCorsHeaders(request, response));

        // CORS OPTIONS route
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });


        // Define routes
        // Serve the default login page
        get("/", (req, res) -> {
            res.redirect("/login");
            return null;
        });

        post("/login", (req, res) -> {
            System.out.println("Request: " + req.body());
        
            // Retrieve the request body as a string
            String requestBody = req.body();

            // Decode the request body (if necessary)
            requestBody = URLDecoder.decode(requestBody, StandardCharsets.UTF_8.toString());
                  
            // Initialize variables to hold username and password
            String email = null;
            String password = null;
        
            // Loop through the parameters and extract username and password
             // Parse the JSON string to a JSON object
            JsonObject jsonObject = JsonParser.parseString(requestBody).getAsJsonObject();

            // Extract email from the JSON object
            email = jsonObject.get("email").getAsString();

            // Extract password from the JSON object
            password = jsonObject.get("password").getAsString();
        
            // Now you can use the email and password variables as needed
            System.out.println("Email: " + email);
            System.out.println("Password: " + password);
            
            User user = User.login(email, password);
            if (user instanceof Customer){      
                Customer c = (Customer) user;
                req.session().attribute("user", c);
            }
            else if (user instanceof EventManager){
                EventManager em = (EventManager) user;
                req.session().attribute("user", em);
            }
            else {
                TicketOfficer to= (TicketOfficer)user;
                req.session().attribute("user", to);
            }

            if (user==null){
                res.status(401);
                return "Invalid username or password";
            }
                        
            return "";
        });

        post("/register", (req, res) -> {
            System.out.println("Request: " + req.body());
        
            // Retrieve the request body as a string
            String requestBody = req.body();

            // Decode the request body (if necessary)
            requestBody = URLDecoder.decode(requestBody, StandardCharsets.UTF_8.toString());
                  
            // Initialize variables to hold username and password
            String name = null;
            String email = null;
            String password = null;
            String outcome = "";
        
            // Loop through the parameters and extract username and password
             // Parse the JSON string to a JSON object
            JsonObject jsonObject = JsonParser.parseString(requestBody).getAsJsonObject();

            // Extract email from the JSON object
            name = jsonObject.get("name").getAsString();
            email = jsonObject.get("email").getAsString();

            // Extract password from the JSON object
            password = jsonObject.get("password").getAsString();
        
            // Now you can use the email and password variables as needed
            System.out.println("Name: " + name);
            System.out.println("Email: " + email);
            System.out.println("Password: " + password);
            
            outcome = User.register(name,password,email);
                        
            return outcome;
        });

        /* get("/user_info", (req, res) -> {
            // Retrieve user information from the session
            User user = req.session().attribute("user");
            User loggedInUser=null;
            if (user instanceof Customer) {
                loggedInUser = (Customer) user;
                // Perform operations specific to Customer
            } else if (user instanceof EventManager) {
                loggedInUser = (EventManager) user;
                // Perform operations specific to EventManager
            } else if (user instanceof TicketOfficer) {
                loggedInUser = (TicketOfficer) user;
                // Perform operations specific to TicketOfficer
            }

            // Read the HTML file content
            String htmlContent = "";
            try {
                FileInputStream fileInputStream = new FileInputStream("src/main/resources/public/user_info.html");
                byte[] data = new byte[fileInputStream.available()];
                fileInputStream.read(data);
                fileInputStream.close();
                htmlContent = new String(data, StandardCharsets.UTF_8);
            } catch (IOException e) {
                e.printStackTrace();
            }
                
            // Inject user information into the HTML content
            htmlContent = htmlContent.replace("{{userId}}", String.valueOf(loggedInUser.getUserID()));
            htmlContent = htmlContent.replace("{{userEmail}}", loggedInUser.getEmail());
        
            // Set response type to HTML
            res.type("text/html");
            
            // Return the modified HTML content
            return htmlContent;
        });   */         

        get("/test", (req, res) -> {
            // Retrieve user information from the session
            User user = req.session().attribute("user");
            // Check if the user is logged in
            if (user != null) {
                // Create a simple text response with the user's information
                String response = "Welcome to testing session!\n";
                response += "Name: " + user.getName() + "\n";
                response += "Email: " + user.getEmail() + "\n";
                response += "ID: " + user.getUserID() + "\n";
                
                // Set response type to plain text
                res.type("text/plain");
                
                // Return the text response
                return response;
            } else {
                // User is not logged in, redirect to the login page
                res.redirect("/login");
                return null;
            }
        });

        get("/get_all_bookable_events", (req, res) -> {
            List<Event> bookableEvents = Event.getAllBookableEvents();
            //Gson gson = new Gson();
            return gson.toJson(bookableEvents);
        });

        get("/get_all_events", (req, res) -> {
            List<Event> getAllEvents = Event.getAllEvents();
            //Gson gson = new Gson();
            return gson.toJson(getAllEvents);
        });

        get("/get_upcoming_events", (req, res) -> {
            List<Event> getUpcomingEvents = Event.getUpcomingEvents();
            //Gson gson = new Gson();
            return gson.toJson(getUpcomingEvents);
        });

        get("/get_immediate_events", (req, res) -> {
            List<Event> getImmediateEvents = Event.getImmediateEvents();
            //Gson gson = new Gson();
            return gson.toJson(getImmediateEvents);
        });
        
        get("/get_event_status_by_id/:id", (req, res) -> {
            String id = req.params(":id");
            boolean eventStatus = Event.getEventStatusByID(Integer.parseInt(id));
            //Gson gson = new Gson();
            return eventStatus;
        });

        // Stop Spark server when the program exits
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            DBConnection.closeConnection(); // Close database connection
            stop(); // Stop Spark server
        }));

        System.out.println("----------------------END OF PARK ROUTING TEST------------------------------");
        // ============================== END TESTING OF ROUTING WITH SPARK =======================================

        
    }
}
