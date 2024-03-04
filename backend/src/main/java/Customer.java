public class Customer extends User{
    // private ArrayList<Booking> bookings;  need to implement bookings class first
    private int amountAvail;
    
    public Customer(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }
    public int getAmountAvail(){
        return amountAvail;
    }

    /* public ArrayList<Booking> getBookingList(){        ========== do only after bookings class is implemented========
        return 
    } */

    /* public void setAmountAvail(){            ====== will  do next time, prolly take in some args========
        this.amountAvail = amountAvail;
    } */
}
