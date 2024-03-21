import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Order {
    private int userID;
    private int orderID;
    private double cancellationFee;
    private double totalPrice;
    private Map<Integer, Integer> eventsBooked;
    private List<Ticket> orderTickets;
    private LocalDateTime dateTime;

    // Map is "1:2" , 1 stands for event id, 2 stands for number of tix
    public Order(int userID, int orderID, Map<Integer, Integer> eventsBooked, double totalPrice, double cancellationFee,
            List<Ticket> orderTickets, LocalDateTime dateTime) {
        this.userID = userID;
        this.orderID = orderID;
        this.eventsBooked = eventsBooked;
        this.totalPrice = totalPrice;
        this.cancellationFee = cancellationFee;
        this.orderTickets = orderTickets;
        this.dateTime = dateTime;
    }

    public int getOrderID() {
        return orderID;
    }

    public List<Ticket> getOrderTickets() {
        return orderTickets;
    }

    public static Order getOrderByID(int orderID) {
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        Order order = null;

        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT o.user_id, t.event_id, t.ticket_id, e.price, e.cancellation_fee, t.status, o.order_datetime " +
                    "FROM orders o " +
                    "JOIN ticket t ON o.order_id = t.order_id " +
                    "JOIN event e ON t.event_id = e.event_id " +
                    "WHERE o.order_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, orderID);
            resultSet = statement.executeQuery();

            Map<Integer, Integer> eventsBooked = new HashMap<>();
            double totalPrice = 0.0;
            double cancellationFee = 0.0;
            List<Ticket> orderTickets = new ArrayList<>();
            int userID = 0;
            LocalDateTime retrieveEventDateTime = null;
            while (resultSet.next()) {
                userID = resultSet.getInt("user_id");
                int eventID = resultSet.getInt("event_id");
                int ticketID = resultSet.getInt("ticket_id");
                double price = resultSet.getDouble("price");
                String ticketStatus = resultSet.getString("status");
                double ticketCancellationFee = resultSet.getDouble("cancellation_fee");
                Timestamp timestamp = resultSet.getTimestamp("order_datetime");
                retrieveEventDateTime = timestamp.toLocalDateTime();

                // Populate ticket list
                Ticket currentTicket = new Ticket(eventID, orderID, ticketID, ticketStatus);
                orderTickets.add(currentTicket);

                // Update eventsBooked map
                eventsBooked.put(eventID, eventsBooked.getOrDefault(eventID, 0) + 1);

                // Update totalPrice
                totalPrice += price;

                // Update cancellation fee
                cancellationFee += ticketCancellationFee;
            }

            // Create Order object
            order = new Order(userID, orderID, eventsBooked, totalPrice, cancellationFee, orderTickets, retrieveEventDateTime);

        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
                if (statement != null) {
                    statement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return order;
    }

    public static ArrayList<Order> getAllOrdersByUserID(int userID) {
        ArrayList<Order> orders = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;

        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT o.order_id, o.user_id, t.event_id, t.ticket_id, e.price, e.cancellation_fee, t.status, o.order_datetime "
                    +
                    "FROM orders o " +
                    "JOIN ticket t ON o.order_id = t.order_id " +
                    "JOIN event e ON t.event_id = e.event_id " +
                    "WHERE o.user_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, userID);
            resultSet = statement.executeQuery();

            Map<Integer, Map<Integer, Integer>> eventsBookedMap = new HashMap<>(); // Map to store eventsBooked for each
                                                                                   // order
            Map<Integer, Double> totalPriceMap = new HashMap<>(); // Map to store totalPrice for each order
            Map<Integer, List<Ticket>> ticketLists = new HashMap<>(); // Map to store tickets for each order
            LocalDateTime retrieveEventDateTime = null;

            while (resultSet.next()) {
                int orderID = resultSet.getInt("order_id");
                int eventID = resultSet.getInt("event_id");
                int ticketID = resultSet.getInt("ticket_id");
                double price = resultSet.getDouble("price");
                String ticketStatus = resultSet.getString("status");
                double ticketCancellationFee = resultSet.getDouble("cancellation_fee");
                Ticket currentTicket = new Ticket(eventID, orderID, ticketID, ticketStatus);
                Timestamp timestamp = resultSet.getTimestamp("order_datetime");
                retrieveEventDateTime = timestamp.toLocalDateTime();

                // Populate ticketLists
                if (!ticketLists.containsKey(orderID)) {
                    ticketLists.put(orderID, new ArrayList<>());
                }
                ticketLists.get(orderID).add(currentTicket);

                // Populate eventsBookedMap
                if (!eventsBookedMap.containsKey(orderID)) {
                    eventsBookedMap.put(orderID, new HashMap<>());
                }

                Map<Integer, Integer> eventTicketsMap = eventsBookedMap.get(orderID);
                eventTicketsMap.put(eventID, eventTicketsMap.getOrDefault(eventID, 0) + 1);

                // Calculate totalPrice and update totalPriceMap
                totalPriceMap.put(orderID, totalPriceMap.getOrDefault(orderID, 0.0) + price);
            }

            // Construct Order objects from the retrieved data
            for (Map.Entry<Integer, Map<Integer, Integer>> entry : eventsBookedMap.entrySet()) {
                int orderID = entry.getKey();
                Map<Integer, Integer> eventsBooked = entry.getValue();
                double totalPrice = totalPriceMap.get(orderID);
                double cancellationFee = 0;

                List<Ticket> orderTickets = ticketLists.get(orderID);
                // TO-DO: Sum up cancellation fees for tickets for each event in the current
                // order
                for (Ticket ticket : orderTickets) {
                    cancellationFee += Event.getEventByID(ticket.getEventID()).getCancellationFee();
                }

                orders.add(new Order(userID, orderID, eventsBooked, totalPrice, cancellationFee, orderTickets, retrieveEventDateTime));
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
                if (statement != null) {
                    statement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return orders;
    }

    public static void createOrder(int userID, Map<Integer, Integer> eventsBooked) {
        PreparedStatement insertStatement = null;
        ResultSet generatedKeys = null;
        try {
            // Check if the email already exists
            DBConnection.establishConnection();

            String insertQuery = "INSERT INTO orders (user_id, order_datetime, status) VALUES (?, ?, ?)";
            insertStatement = DBConnection.getConnection().prepareStatement(insertQuery,
                    Statement.RETURN_GENERATED_KEYS);
            insertStatement.setInt(1, userID);
            insertStatement.setObject(2, LocalDateTime.now());
            insertStatement.setString(3, "delivered");
            insertStatement.executeUpdate();

            // Retrieve the generated key (order ID)
            generatedKeys = insertStatement.getGeneratedKeys();
            if (generatedKeys.next()) {
                int orderId = generatedKeys.getInt(1);

                // Insert tickets with the same order ID
                String insertTicketQuery = "INSERT INTO ticket (event_id, order_id, status) VALUES (?, ?, ?)";
                insertStatement = DBConnection.getConnection().prepareStatement(insertTicketQuery);
                for (Map.Entry<Integer, Integer> entry : eventsBooked.entrySet()) {
                    int eventId = entry.getKey();
                    int quantity = entry.getValue();
                    for (int i = 0; i < quantity; i++) {
                        insertStatement.setInt(1, eventId);
                        insertStatement.setInt(2, orderId);
                        insertStatement.setString(3, "delivered");
                        insertStatement.addBatch(); // Add batch for batch insertion
                    }
                }
                // Execute batch insertion of tickets
                insertStatement.executeBatch();

                //send confirmation Email
                //info needed: int orderId, String username, double total_paid, LocalDateTime orderDatetime, ArrayList<String, String> purchase
                // in purchase - {price: "", quantity: "", eventName: "", eventDetails: ""}
                Order order = getOrderByID(orderId);
                int userId = order.getUserId();
                String username = User.getUserByID(userId).getName();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String orderDateTime = order.getDateTime().format(formatter);
                double total_paid = 0.0;
                ArrayList<HashMap<String, String>> purchases = new ArrayList<>();

                for (Map.Entry<Integer, Integer> entry : eventsBooked.entrySet()) {
                    int eventId = entry.getKey();
                    Event event = Event.getEventByID(eventId);
                    double price = event.getTicketPrice();
                    total_paid += price;
                    String eventName = event.getEventName();
                    String eventDetails = event.getVenue() + "\n" + event.getEventDateTime().format(formatter);
                    Integer quantity = entry.getValue();
    
                    HashMap<String, String> obj = new HashMap<>();
                    obj.put("price", Double.toString(price));
                    obj.put("quantity", Integer.toString(quantity));
                    obj.put("eventName", eventName);
                    obj.put("eventDetails", eventDetails);

                    purchases.add(obj);
                }

                System.out.println(orderId + " " + username + " " + total_paid + " " + orderDateTime);
                Mail.sendEmail(orderId, username, total_paid, orderDateTime, purchases);

                // return orderId; // Return the order ID as a string
            } else {
                // Handle if no generated key is found
                return;
            }

        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            // Handle exception, maybe return an error message
            return;

        } finally {
            try {
                // Close result set, statement, and database connection
                if (generatedKeys != null) {
                    generatedKeys.close();
                }
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
                // Handle exception, maybe log it
            }
        }
    }

    public static String checkOutOrder(Map<Integer, Integer> eventsBooked, int orderID) {
        PreparedStatement insertStatement = null;
        try {
            // Check if the email already exists
            DBConnection.establishConnection();

            String insertQueryTicket = "INSERT INTO ticket (event_id, order_id, cancellation_fee,status) VALUES (?, ?, ?, ?)";
            String insertQueryGuest = "INSERT INTO user_accompanying_guest (user_id, event_id, num_accompanying_guest) VALUES (?, ?, ?)";

            insertStatement = DBConnection.getConnection().prepareStatement(insertQueryTicket);

            for (Map.Entry<Integer, Integer> entry : eventsBooked.entrySet()) {
                int eventId = entry.getKey();
                Integer numTickets = entry.getValue();

                for (int i = 0; i < numTickets; i++) {
                    insertStatement.setInt(1, eventId);
                    insertStatement.setInt(2, orderID);
                    insertStatement.setInt(3, 10); // Assuming cancellation fee is always 10 will need to change
                    insertStatement.setString(4, "delivered");

                    insertStatement.executeUpdate();
                }

                // Insert new record into user_accompanying_guest table
                // PreparedStatement insertGuestStatement = DBConnection.getConnection()
                //         .prepareStatement(insertQueryGuest);
                // insertGuestStatement.setInt(1, orderID);
                // insertGuestStatement.setInt(2, eventId);
                // insertGuestStatement.setInt(3, numGuests);
                // insertGuestStatement.executeUpdate();
                // insertGuestStatement.close();
            }

        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();

        } finally {
            try {
                if (insertStatement != null) {
                    insertStatement.close();

                }
                DBConnection.closeConnection();
                return "";
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return "success";
    }

    public static void deductPaymentForCheckout(int userID, double totalAmount) { // do secured payment instead
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT amount_avail FROM user WHERE user_id = ?";
            PreparedStatement statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, userID);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                int amountAvail = resultSet.getInt("amount_avail");
                if (amountAvail >= totalAmount) {
                    String updateQuery = "UPDATE user SET amount_avail = amount_avail - ? WHERE user_id = ?";
                    PreparedStatement updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
                    updateStatement.setDouble(1, totalAmount);
                    updateStatement.setInt(2, userID);
                    updateStatement.executeUpdate();
                    updateStatement.close();
                } else {
                    System.out.println("Insufficient funds!");
                }
            }

            resultSet.close();
            statement.close();
            DBConnection.closeConnection();
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        }
    }

    /*
     * public static String updateCancellationFee(int updatedCancellationFee){
     * //shud be set cancellationfee???
     * PreparedStatement insertStatement = null;
     * try {
     * DBConnection.establishConnection();
     * 
     * String insertQuery = "Update ticket SET cancellation_fee= ?";
     * insertStatement = DBConnection.getConnection().prepareStatement(insertQuery);
     * insertStatement.setInt(1, updatedCancellationFee);
     * 
     * insertStatement.executeUpdate();
     * 
     * } catch (SQLException | ClassNotFoundException se) {
     * se.printStackTrace();
     * return "Error occurred while updating cancellation fee: " + se.getMessage();
     * 
     * } finally {
     * try {
     * if (insertStatement != null) {
     * insertStatement.close();
     * }
     * DBConnection.closeConnection();
     * return "";
     * } catch (SQLException e) {
     * e.printStackTrace();
     * }
     * }
     * return "success";
     * }
     */

    public void setCancellationFee(int newCancellationFee) { // maybe put in eventManager???? idk
        this.cancellationFee = newCancellationFee;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public int getUserId() {
        return userID;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }
}