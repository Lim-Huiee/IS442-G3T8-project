import java.io.FileWriter;
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
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
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

        /// ==================== Testing of User/TicketOfficer class
        /// =======================================

        System.out
                .println("=============================Start OF TESTING FOR USER & CUSTOMER CLASS====================");
        try {
            // Usage example: retrieve user with ID 1
            User user = User.getUserByID(1);
            User customer = null;

            if (user != null) {
                System.out.println(user.toString()); // prints object
                customer = User.login("user 2", "password2"); // customer login, returns object
                System.out.println(User.login("user 1", "password2")); // login fail, returns null because login()
                                                                       // returns object

                System.out.println(User.login("ticket man", "password5")); // ticket officer login, returns user object
                System.out.println(User.register("Dehou", "pwpwpw", "Dehou@gmail.com")); // Register successfully if u
                                                                                         // run the first time. Else,
                                                                                         // username exists
                System.out.println(User.register("Dehouhehexd", "asd", "haha")); // invalid email

                System.out.println("test update user details");
                System.out.println(User.updateUserDetails(6, "Dehouhehexd", "newPw", "haha@gmail.com"));

                System.out.println("Construct Customer from User");
                Customer cust = new Customer(user.getUserID(), user.getName(), user.getPassword(), user.getEmail(),
                        1000.00);
                System.out.println(cust.toString());
                System.out.println(cust.getAmountAvail()); // class cast, testing getAmountAvail() for customer
                System.out.println("Test update $$");
                cust.setAmountAvail(500.32);
                System.out.println("New amount:" + cust.getAmountAvail());

            } else {
                System.out.println("User not found.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("=============================END OF TESTING FOR USER & CUSTOMER CLASS====================");

        System.out.println("=============================START OF TESTING FOR EVENT MANAGER CLASS===========");
        User eventManager = null;
        try {
            eventManager = User.login("em@tm.com", "password4"); // event manager login, returns user object

            if (eventManager != null) {
                if (eventManager instanceof EventManager) {
                    EventManager em = (EventManager) eventManager;
                    String eventType = "Concert";
                    String eventName = "Taylor Swift Concert";
                    String venue = "National Stadium";
                    LocalDateTime eventDateTime = LocalDateTime.of(2024, 12, 31, 20, 0); // Example datetime
                    int numTotalTickets = 1000;
                    int numTicketsAvailable = 1000;
                    String eventDetails = "A typical  Event";
                    double ticketPrice = 90;
                    double cancellationFee = 20.00;
                    String result = EventManager.createEvent(eventType, eventName, venue, eventDateTime,
                            numTotalTickets,
                            numTicketsAvailable, eventDetails, ticketPrice, cancellationFee);
                    System.out.println(result); // creates new event in DB, will print "event exists" if you run it a
                                                // 2nd time

                    // update taylor swift event
                    String updateResult = EventManager.updateEvent(5, eventType, eventName, "my house", eventDateTime,
                            numTotalTickets, 998, eventDetails, ticketPrice, cancellationFee);
                    System.out.println(updateResult);

                    /*
                     * // delete taylor swift event ==================== uncomment this part to test
                     * delete =============
                     * String deleteResult = em.deleteEvent(5);
                     * System.out.println(deleteResult);
                     */

                    // ======================================= event manager adding ticket
                    // officer============================
                    String addTicketingOfficerResult = EventManager.addTicketingOfficer("Jeremy", "123",
                            "jeremy@hotmail.com");
                    System.out.println(addTicketingOfficerResult);

                    // view sale statistics test, output is in readable format for testing, will
                    // amend output next time
                    System.out.println(EventManager.viewSaleStatistics());
                }
            }

            // update event parameters: int eventID, String eventName, String venue,
            // LocalDateTime dateTime, int numTotalTickets, int numTicketsAvailable, String
            // eventDetails, int ticketPrice

            if (eventManager instanceof EventManager) { // FOR TESTING ONLY/ can change to check instanceof Customer, it
                                                        // won't print "pass".
                System.out.println("pass"); // Verifies access control, means customer wont access eventManager etc
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("=============================END OF TESTING FOR EVENT MANAGER CLASS===========");
        // =========================== END TESTING OF EVENT MANAGER
        // CLASS====================

        // =============================START OF TESTING FOR EVENT
        // CLASS=========================================

        System.out.println("=============================START OF TESTING FOR EVENT CLASS================");
        Event testEvent = Event.getEventByID(4);
        System.out.println(testEvent);
        System.out.println(testEvent.getEventID());

        System.out.println("------ Start of testing get Alll bookable events-------");
        ArrayList<Event> allEvents = Event.getAllBookableEvents();
        for (Event event : allEvents) {
            System.out.println(event.getEventName());
            System.out.println("Number of tickets sold is " + event.numTicketsSold());
            System.out.println("Revenue is " + event.revenueEarned() + "\n");
        }

        System.out.println("------ Start of testing get upcoming bookable events-------");
        ArrayList<Event> upcomingEvents = Event.getUpcomingEvents();
        for (Event event : upcomingEvents) {
            System.out.println(event.getEventName());
        }

        // ==============================END TESTING FOR EVENT CLASS
        // =========================================

        // TEST CREATE ORDER AND EMAIL SENDING
        System.out.println(
                "----------------------START OF CREATING ORDER & SENDING EMAIL TEST------------------------------");
        Map<Integer, Integer> purchase = new HashMap<>();
        purchase.put(1, 4);
        purchase.put(2, 3);
        purchase.put(3, 5);
        purchase.put(4, 1);
        Order.createOrder(1, purchase);
        System.out.println(
                "----------------------END OF CREATING ORDER & SENDING EMAIL TEST------------------------------");

        List<Integer> deleteTickets = new ArrayList<>();
        deleteTickets.add(6);
        deleteTickets.add(7);

        Ticket.cancelTickets(deleteTickets);

        Order a = Order.getOrderByID(5);

        List<Ticket> ticketsInOrder = a.getOrderTickets();
        for (Ticket m : ticketsInOrder) {
            System.out.println("Tickets in order" + m);
            System.out.println(m.getTicketStatus());
        }
        // change getallordersbyuser method

        System.out.println("------------------------------End Testing of CHECKOUT ORDER------------------------");

        System.out.println("----------------------------Testing of taking attendance for tix------------------------");
        ArrayList<Integer> arrList = Ticket.getAllTicketIDsForEvent(1);
        for (Integer ticketID : arrList) {
            System.out.println(ticketID);
        }

        // hardcoding for testing
        ArrayList<Integer> attendedTix = new ArrayList<Integer>();
        attendedTix.add(1);
        attendedTix.add(4);
        attendedTix.add(6);
        attendedTix.add(7);
        User toOfficer = User.login("to@tm.com", "password5");

        TicketOfficer castToOfficer = (TicketOfficer) toOfficer;
        // TicketOfficer toOfficer = new TicketOfficer(5, "ticket man", "password5",
        // "to@tm.com");
        castToOfficer.takeAttendance(1, attendedTix);

        Map<Integer, Integer> purchasetest = new HashMap<>();
        purchasetest.put(1, 2);
        Order.createOrder(5, purchasetest);

        System.out.println(
                "----------------------------End Testing of taking attendance for tix------------------------");

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
            if (user instanceof Customer) {
                Customer c = (Customer) user;
                req.session().attribute("user", c);
            } else if (user instanceof EventManager) {
                EventManager em = (EventManager) user;
                req.session().attribute("user", em);
            } else {
                TicketOfficer to = (TicketOfficer) user;
                req.session().attribute("user", to);
            }

            if (user == null) {
                res.status(401);
                return "Invalid username or password";
            }

            // Create a JSON object to send back as the response
            JsonObject responseData = new JsonObject();
            responseData.addProperty("message", "Login successful");
            responseData.addProperty("userId", user.getUserID()); // Add user ID to the response
            responseData.addProperty("email", user.getEmail()); // Add email to the response
            responseData.addProperty("name", user.getName()); // Add name to the response

            // Set response type to JSON
            res.type("application/json");

            // Return the JSON object directly
            return responseData;
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

            outcome = User.register(name, password, email);

            return outcome;
        });

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

        get("/get_user_by_id/:id", (req, res) -> {
            String id = req.params(":id");
            User userByID = User.getUserByID(Integer.parseInt(id));
            // Gson gson = new Gson();
            return gson.toJson(userByID);
        });

        put("/update_user_details/:id", (req, res) -> {
            int userId = Integer.parseInt(req.params(":id"));
            String newName = req.queryParams("newName");
            String newPassword = req.queryParams("newPassword");
            String newEmail = req.queryParams("newEmail");
            boolean success = User.updateUserDetails(userId, newName, newPassword, newEmail);
            return new Gson().toJson(success);
        });

        get("/get_amount_avail_by_user_id/:id", (req, res) -> {
            int id = Integer.parseInt(req.params(":id"));
            double amountAvail = Customer.retrieveAmountAvailFromDB(id);
            return new Gson().toJson(amountAvail);
        });

        put("/update_amount_avail/:id/:newAmount", (req, res) -> {
            int userId = Integer.parseInt(req.params(":id"));
            double newAmountAvail = Double.parseDouble(req.params(":newAmount"));
            boolean success = Customer.updateAmountAvailInDB(userId, newAmountAvail);
            return new Gson().toJson(success);
        });

        get("/get_users_by_role/:roleName", (req, res) -> {
            String roleName = req.params(":roleName");
            List<User> usersByRole = User.getUsersByRole(roleName);
            // Gson gson = new Gson();
            return gson.toJson(usersByRole);
        });

        get("/get_event_by_id/:id", (req, res) -> {
            String id = req.params(":id");
            Event event = Event.getEventByID(Integer.parseInt(id));
            // Gson gson = new Gson();
            return gson.toJson(event);
        });

        get("/get_all_bookable_events", (req, res) -> {
            List<Event> bookableEvents = Event.getAllBookableEvents();
            // Gson gson = new Gson();
            return gson.toJson(bookableEvents);
        });

        get("/get_all_events", (req, res) -> {
            List<Event> getAllEvents = Event.getAllEvents();
            // Gson gson = new Gson();
            return gson.toJson(getAllEvents);
        });

        get("/get_upcoming_events", (req, res) -> {
            List<Event> getUpcomingEvents = Event.getUpcomingEvents();
            // Gson gson = new Gson();
            return gson.toJson(getUpcomingEvents);
        });

        get("/get_immediate_events", (req, res) -> {
            List<Event> getImmediateEvents = Event.getImmediateEvents();
            // Gson gson = new Gson();
            return gson.toJson(getImmediateEvents);
        });

        get("/get_event_status_by_id/:id", (req, res) -> {
            String id = req.params(":id");
            boolean eventStatus = Event.getEventStatusByID(Integer.parseInt(id));
            // Gson gson = new Gson();
            return eventStatus;
        });

        post("/create_event", (req, res) -> {
            String jsonData = req.body();

            Event eventData = gson.fromJson(jsonData, Event.class);
            String eventType = eventData.getEventType();
            String eventName = eventData.getEventName();
            String venue = eventData.getVenue();
            LocalDateTime dateTime = eventData.getEventDateTime();
            int numTotalTickets = eventData.getTotalTickets();
            int numTicketsAvailable = eventData.getTicketsAvailable();
            String eventDetails = eventData.getEventDetails();
            double ticketPrice = eventData.getTicketPrice();
            double cancellationFee = eventData.getCancellationFee();

            String eventCreated = EventManager.createEvent(eventType, eventName, venue, dateTime, numTotalTickets,
                    numTicketsAvailable, eventDetails, ticketPrice, cancellationFee);
            return eventCreated;
        });

        put("/update_event", (req, res) -> {
            String jsonData = req.body();

            Event eventData = gson.fromJson(jsonData, Event.class);
            int eventID = eventData.getEventID();
            String eventType = eventData.getEventType();
            String eventName = eventData.getEventName();
            String venue = eventData.getVenue();
            LocalDateTime dateTime = eventData.getEventDateTime();
            int numTotalTickets = eventData.getTotalTickets();
            int numTicketsAvailable = eventData.getTicketsAvailable();
            String eventDetails = eventData.getEventDetails();
            double ticketPrice = eventData.getTicketPrice();
            double cancellationFee = eventData.getCancellationFee();

            String eventCreated = EventManager.updateEvent(eventID, eventType, eventName, venue, dateTime,
                    numTotalTickets, numTicketsAvailable, eventDetails, ticketPrice, cancellationFee);
            return eventCreated;
        });

        post("/add_ticketing_officer", (req, res) -> {
            String jsonData = req.body();

            TicketOfficer ticketOfficerData = gson.fromJson(jsonData, TicketOfficer.class);
            String name = ticketOfficerData.getName();
            String password = ticketOfficerData.getPassword();
            String email = ticketOfficerData.getEmail();

            String ticketOfficerCreated = EventManager.addTicketingOfficer(name, password, email);
            return ticketOfficerCreated;
        });

        put("/update_ticketing_officer", (req, res) -> {
            String jsonData = req.body();

            User ticketOfficerData = gson.fromJson(jsonData, User.class);
            int id = ticketOfficerData.getUserID();
            String name = ticketOfficerData.getName();
            String password = ticketOfficerData.getPassword();
            String email = ticketOfficerData.getEmail();

            String ticketOfficerUpdated = EventManager.updateTicketingOfficer(id, name, password, email);
            return ticketOfficerUpdated;
        });

        delete("/delete_event/:id", (req, res) -> {
            String id = req.params(":id");
            String eventDeleted = EventManager.deleteEvent(Integer.parseInt(id));
            // Gson gson = new Gson();
            return eventDeleted;
        });

        get("/view_sales_statistics", (req, res) -> {
            List<Map<String, String>> statistics = EventManager.viewSaleStatistics();
            // Gson gson = new Gson();
            return gson.toJson(statistics);
        });

        post("/create_order", (req, res) -> {
            String jsonData = req.body();

            // Assuming the request body contains the user ID and events booked data in JSON
            // format
            JsonObject jsonObject = JsonParser.parseString(jsonData).getAsJsonObject();
            int userId = jsonObject.get("userId").getAsInt();
            JsonObject eventsBookedJson = jsonObject.get("eventsBooked").getAsJsonObject();

            // Convert events booked JSON to Map<Integer, Integer>
            Map<Integer, Integer> eventsBooked = new HashMap<>();
            for (Map.Entry<String, JsonElement> entry : eventsBookedJson.entrySet()) {
                int eventId = Integer.parseInt(entry.getKey());
                int quantity = entry.getValue().getAsInt();
                eventsBooked.put(eventId, quantity);
            }

            // Call your Java method to create the order
            Order.createOrder(userId, eventsBooked);

            // You may return a success message or status code if needed
            return "Order created successfully";
        });

        get("/get_orders/:userId", (req, res) -> {
            int userId = Integer.parseInt(req.params("userId"));
            ArrayList<Order> orders = Order.getAllOrdersByUserID(userId);
            String jsonResult = gson.toJson(orders);
            return jsonResult;
        });

        get("/generate_report", (req, res) -> {
            List<Map<String, String>> statistics = EventManager.viewSaleStatistics();
            // Gson gson = new Gson();
            // Generate CSV from statistics
            String csvReport = EventManager.generateReport(statistics);

            // Write the CSV report to a file
            try (FileWriter writer = new FileWriter("sales_statistics.csv")) {
                writer.write(csvReport);
                System.out.println("CSV report generated successfully.");
            } catch (IOException e) {
                System.err.println("Error writing CSV report: " + e.getMessage());
            }
            return "CSV report generated successfully.";
        });

        get("/ticketids_for_event/:id", (req, res) -> {
            String id = req.params(":id");
            // Gson gson = new Gson();
            ArrayList<Integer> allTicketIDsForEvent = Ticket.getAllTicketIDsForEvent(1);

            return gson.toJson(allTicketIDsForEvent);
        });

        post("/take_attendance/:eventId", (req, res) -> {
            // Extract event ID from URL
            int eventId = Integer.parseInt(req.params(":eventId"));

            // Extract data from request body
            String jsonData = req.body();
            JsonObject jsonObject = new Gson().fromJson(jsonData, JsonObject.class);
            JsonArray attendedTixJson = jsonObject.get("attendedTickets").getAsJsonArray();

            // Convert attendedTickets JSON to ArrayList<Integer>
            ArrayList<Integer> attendedTickets = new ArrayList<>();
            for (JsonElement element : attendedTixJson) {
                attendedTickets.add(element.getAsInt());
            }
            User user = req.session().attribute("user");
            User loggedInUser = null;
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

            // Call your Java method to take attendance
            TicketOfficer ticketOfficer = (TicketOfficer) loggedInUser; // Assuming there's a method to retrieve
                                                                        // TicketOfficer by ID
            ticketOfficer.takeAttendance(eventId, attendedTickets);

            // You may return a success message or status code if needed
            return "Attendance taken successfully";
        });

        System.out.println("----------------------START OF REFUND TEST------------------------------");
        post("/process_refund/:userID/:ticketID", (req, res) -> {
            // Extract event ID from URL
            int userID = Integer.parseInt(req.params(":userID"));
            int ticketID = Integer.parseInt(req.params(":ticketID"));
            String result = Refund.process_refund(ticketID, userID);
            return result;
        });

        // Stop Spark server when the program exits
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            DBConnection.closeConnection(); // Close database connection
            stop(); // Stop Spark server
        }));

        System.out.println("----------------------END OF PARK ROUTING TEST------------------------------");
        // ============================== END TESTING OF ROUTING WITH SPARK
        // =======================================
    }
}
