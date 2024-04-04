import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.sql.Timestamp;

public class Event {
    private int eventID;
    private String eventType;
    private String eventName;
    private String venue;
    private LocalDateTime eventDateTime;
    private int numTotalTickets;
    private int numTicketsAvailable;
    private String eventDetails;
    private double ticketPrice;
    private double cancellationFee;

    // with event ID
    public Event(int eventID, String eventType, String eventName, String venue, LocalDateTime eventDateTime,
            int numTotalTickets, int numTicketsAvailable, String eventDetails, double ticketPrice,
            double cancellationFee) {
        this.eventID = eventID;
        this.eventType = eventType;
        this.eventName = eventName;
        this.venue = venue;
        this.eventDateTime = eventDateTime;
        this.numTotalTickets = numTotalTickets;
        this.numTicketsAvailable = numTicketsAvailable;
        this.eventDetails = eventDetails;
        this.ticketPrice = ticketPrice;
        this.cancellationFee = cancellationFee;
    }

    public String setNumTicketsAvailable(int tickets) {
        this.numTicketsAvailable = tickets;
        // create sql query to update in db
        PreparedStatement updateStatement = null;
        try {
            DBConnection.establishConnection();

            String updateQuery = "UPDATE event SET num_tickets_avail = ? WHERE event_id = ?";
            updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
            updateStatement.setDouble(1, tickets);
            updateStatement.setInt(2, eventID);

            int rowsAffected = updateStatement.executeUpdate();

            if (rowsAffected > 0) {
                return "Success";
            } else {
                return "Error: No event found with the provided event_id";
            }

        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "Error occurred while updating cancellation fee: " + se.getMessage();

        } finally {
            try {
                if (updateStatement != null) {
                    updateStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
                return "Error occurred: " + e.getMessage();
            }
        }
    }

    public int getEventID() {
        return eventID;
    }

    public String getEventType() {
        return eventType;
    }

    public String getEventName() {
        return eventName;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public int getTotalTickets() {
        return numTotalTickets;
    }

    public int getTicketsAvailable() {
        return numTicketsAvailable;
    }

    public String getEventDetails() {
        return eventDetails;
    }

    public double getTicketPrice() {
        return ticketPrice;
    }

    public double getCancellationFee() {
        return cancellationFee;
    }

    public int numTicketsSold() {
        return numTotalTickets - numTicketsAvailable;
    }

    public double revenueEarned() {
        return this.numTicketsSold() * ticketPrice;
    }

    // not sure if need setter methods?

    public static Event getEventByID(int searchEventID) {
        Event event = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event WHERE event_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, searchEventID);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveEventType = resultSet.getString("event_type");
                String retrieveEventName = resultSet.getString("event_name");
                String retrieveVenue = resultSet.getString("venue");

                Timestamp timestamp = resultSet.getTimestamp("datetime");
                LocalDateTime retrieveEventDateTime = timestamp.toLocalDateTime();

                int retrieveNumTotalTickets = resultSet.getInt("total_tickets");
                int retrieveNumTicketsAvailable = resultSet.getInt("num_tickets_avail");
                String retrieveEventDetails = resultSet.getString("event_details");
                double retrieveTicketPrice = resultSet.getDouble("price");
                double retrieveCancellationFee = resultSet.getDouble("cancellation_fee");

                event = new Event(retrievedEventID, retrieveEventType, retrieveEventName, retrieveVenue,
                        retrieveEventDateTime, retrieveNumTotalTickets, retrieveNumTicketsAvailable,
                        retrieveEventDetails, retrieveTicketPrice, retrieveCancellationFee);
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
        return event;
    }

    public static boolean getEventStatusByID(int searchEventID) {
        Event event = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event WHERE num_tickets_avail > 0 AND datetime > NOW() AND datetime < DATE_ADD(NOW(), INTERVAL 6 MONTH) AND TIMESTAMPDIFF(HOUR, NOW(), datetime) > 24";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {

                int retrievedEventID = resultSet.getInt("event_id");
                if (searchEventID == retrievedEventID) {
                    return true; // means event is bookable
                }
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
        return false;
    }

    public static ArrayList<Event> getAllBookableEvents() {
        ArrayList<Event> events = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event WHERE num_tickets_avail > 0 AND datetime > NOW() AND datetime < DATE_ADD(NOW(), INTERVAL 6 MONTH) AND TIMESTAMPDIFF(HOUR, NOW(), datetime) > 24";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveEventType = resultSet.getString("event_type");
                String retrieveEventName = resultSet.getString("event_name");
                String retrieveVenue = resultSet.getString("venue");

                Timestamp timestamp = resultSet.getTimestamp("datetime");
                LocalDateTime retrieveEventDateTime = timestamp.toLocalDateTime();

                int retrieveNumTotalTickets = resultSet.getInt("total_tickets");
                int retrieveNumTicketsAvailable = resultSet.getInt("num_tickets_avail");
                String retrieveEventDetails = resultSet.getString("event_details");
                double retrieveTicketPrice = resultSet.getDouble("price");
                double retrieveCancellationFee = resultSet.getDouble("cancellation_fee");

                Event event = new Event(retrievedEventID, retrieveEventType, retrieveEventName, retrieveVenue,
                        retrieveEventDateTime, retrieveNumTotalTickets, retrieveNumTicketsAvailable,
                        retrieveEventDetails, retrieveTicketPrice, retrieveCancellationFee);
                events.add(event);
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
        return events;
    }

    public static ArrayList<Event> getUpcomingEvents() {
        ArrayList<Event> events = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event WHERE num_tickets_avail > 0 AND datetime > NOW() AND datetime > DATE_ADD(NOW(), INTERVAL 6 MONTH)";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveEventType = resultSet.getString("event_type");
                String retrieveEventName = resultSet.getString("event_name");
                String retrieveVenue = resultSet.getString("venue");

                Timestamp timestamp = resultSet.getTimestamp("datetime");
                LocalDateTime retrieveEventDateTime = timestamp.toLocalDateTime();

                int retrieveNumTotalTickets = resultSet.getInt("total_tickets");
                int retrieveNumTicketsAvailable = resultSet.getInt("num_tickets_avail");
                String retrieveEventDetails = resultSet.getString("event_details");
                double retrieveTicketPrice = resultSet.getDouble("price");
                double retrieveCancellationFee = resultSet.getDouble("cancellation_fee");

                Event event = new Event(retrievedEventID, retrieveEventType, retrieveEventName, retrieveVenue,
                        retrieveEventDateTime, retrieveNumTotalTickets, retrieveNumTicketsAvailable,
                        retrieveEventDetails, retrieveTicketPrice, retrieveCancellationFee);
                events.add(event);
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
        return events;
    }

    public static ArrayList<Event> getImmediateEvents() {
        ArrayList<Event> events = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event WHERE datetime > NOW() AND datetime < DATE_ADD(NOW(), INTERVAL 24 HOUR)";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveEventType = resultSet.getString("event_type");
                String retrieveEventName = resultSet.getString("event_name");
                String retrieveVenue = resultSet.getString("venue");

                Timestamp timestamp = resultSet.getTimestamp("datetime");
                LocalDateTime retrieveEventDateTime = timestamp.toLocalDateTime();

                int retrieveNumTotalTickets = resultSet.getInt("total_tickets");
                int retrieveNumTicketsAvailable = resultSet.getInt("num_tickets_avail");
                String retrieveEventDetails = resultSet.getString("event_details");
                double retrieveTicketPrice = resultSet.getDouble("price");
                double retrieveCancellationFee = resultSet.getDouble("cancellation_fee");

                Event event = new Event(retrievedEventID, retrieveEventType, retrieveEventName, retrieveVenue,
                        retrieveEventDateTime, retrieveNumTotalTickets, retrieveNumTicketsAvailable,
                        retrieveEventDetails, retrieveTicketPrice, retrieveCancellationFee);
                events.add(event);
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
        return events;
    }

    public static ArrayList<Event> getAllEvents() {
        ArrayList<Event> events = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveEventType = resultSet.getString("event_type");
                String retrieveEventName = resultSet.getString("event_name");
                String retrieveVenue = resultSet.getString("venue");

                Timestamp timestamp = resultSet.getTimestamp("datetime");
                LocalDateTime retrieveEventDateTime = timestamp.toLocalDateTime();

                int retrieveNumTotalTickets = resultSet.getInt("total_tickets");
                int retrieveNumTicketsAvailable = resultSet.getInt("num_tickets_avail");
                String retrieveEventDetails = resultSet.getString("event_details");
                double retrieveTicketPrice = resultSet.getDouble("price");
                double retrieveCancellationFee = resultSet.getDouble("cancellation_fee");

                Event event = new Event(retrievedEventID, retrieveEventType, retrieveEventName, retrieveVenue,
                        retrieveEventDateTime, retrieveNumTotalTickets, retrieveNumTicketsAvailable,
                        retrieveEventDetails, retrieveTicketPrice, retrieveCancellationFee);
                events.add(event);
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
        return events;
    }

    public static String setCancellationFee(int event_id, double updatedCancellationFee) {
        PreparedStatement updateStatement = null;
        try {
            DBConnection.establishConnection();

            String updateQuery = "UPDATE event SET cancellation_fee = ? WHERE event_id = ?";
            updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
            updateStatement.setDouble(1, updatedCancellationFee);
            updateStatement.setInt(2, event_id);

            int rowsAffected = updateStatement.executeUpdate();

            if (rowsAffected > 0) {
                return "Success";
            } else {
                return "No event found with the provided event_id";
            }

        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "Error occurred while updating cancellation fee: " + se.getMessage();

        } finally {
            try {
                if (updateStatement != null) {
                    updateStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public static String reduceTickets(int eventID, int numTicketsToReduce) {
        PreparedStatement updateStatement = null;
        try {
            // Check if the event exists and has enough available tickets
            Event event = getEventByID(eventID);
            if (event == null) {
                return "Event with ID " + eventID + " not found.";
            }
            if (event.getTicketsAvailable() < numTicketsToReduce) {
                return "Not enough tickets available for event " + eventID + ".";
            }
            System.out.println(event.toString());

            DBConnection.establishConnection();
    
            // Update the number of tickets available for the event
            String updateQuery = "UPDATE event SET num_tickets_avail = num_tickets_avail - ? WHERE event_id = ?";
            updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
            updateStatement.setInt(1, numTicketsToReduce);
            updateStatement.setInt(2, eventID);
    
            int rowsAffected = updateStatement.executeUpdate();
    
            if (rowsAffected > 0) {
                return "Success, num tickets avail reduced";
            } else {
                return "Failed to reduce tickets for event " + eventID + ".";
            }
    
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "Error occurred while reducing tickets: " + se.getMessage();
    
        } finally {
            try {
                if (updateStatement != null) {
                    updateStatement.close();
                }
                DBConnection.closeConnection();
            } 
            catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public int getNumTicketsSoldByTicketOfficer() {
        int currentEventID = this.getEventID(); // Get current event ID
        int numTicketsSold = 0;

        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            DBConnection.establishConnection();

            // Query to retrieve the sum of ticket counts for ticketing officers
            String query = "SELECT COUNT(ticket.ticket_id) AS ticket_count " +
                           "FROM ticket " +
                           "INNER JOIN orders ON ticket.order_id = orders.order_id " +
                           "INNER JOIN user ON orders.user_id = user.user_id " +
                           "WHERE user.role = 'ticketing officer' AND ticket.event_id = ?";
            statement = DBConnection.getConnection().prepareStatement(query);
            statement.setInt(1, currentEventID);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                numTicketsSold = resultSet.getInt("ticket_count");
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
        return numTicketsSold;
    }

    public int sumTotalAttendees(){
        int currentEventID = this.getEventID(); // Get current event ID
        int numAttendees = 0;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            DBConnection.establishConnection();

            // Query to retrieve the sum of ticket counts for attendees
            String query = "SELECT COUNT(ticket.ticket_id) AS num_attendees " +
                        "FROM ticket " +
                        "WHERE ticket.event_id = ? AND ticket.attended = 'yes'";
            statement = DBConnection.getConnection().prepareStatement(query);
            statement.setInt(1, currentEventID);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                numAttendees = resultSet.getInt("num_attendees");
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
        return numAttendees;
    }


}
