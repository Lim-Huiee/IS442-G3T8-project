public class User {
    private String username;
    private String password;
    private int userID;
    private String email;

    public User(int userID, String username, String password, String email){
        this.username = username;
        this.password = password;
        this.userID = userID;
        this.email = email;
    }

    // Getters and setters for userID, username, password, and email
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static User getUserByID(int userID) {
        return DBConnection.dbGetUserById(userID);
    } 

    // toString method to represent User object as string
    @Override
    public String toString() {
        return "User{" +
                "userID=" + userID +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                '}';    
    }
}
