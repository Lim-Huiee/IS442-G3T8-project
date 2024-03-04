public class User {
    private String name;
    private String password;
    private int userID;
    private String email;

    public User(int userID, String name, String password, String email){
        this.name = name;
        this.password = password;
        this.userID = userID;
        this.email = email;
    }

    // Getters and setters for userID, name, password, and email
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String login(String name){
        return "Login Successful"; 
    }



    // toString method to represent User object as string
    @Override
    public String toString() {
        return "User{" +
                "userID=" + userID +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                '}';    
    }
}
