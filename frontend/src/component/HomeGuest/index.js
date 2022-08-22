import image from "../../assets/online-event.png"
import "../HomeGuest/HomeGuest.css"

export default function HomeGuest(){
    return(
        <div className="home-guest-main-div">
            <div className="sub-div-guest-view">
                <div className="left-intro-div">
                    <div >
                        <h1>Celebrating 20 years of real connections on Meetup</h1>
                    </div>
                    <div >
                        <p className="guest-view-p">
                        Whatever you’re looking to do this year, Meetup can help. For 20 
                        years, people have turned to Meetup to meet people, make friends, 
                        find support, grow a business, and explore their interests. 
                        Thousands of events are happening every day—join the fun.
                        </p>
                    </div>
                </div>
                <div className="right-intro-div">
                <img src={image} alt="intro" className="intro-image"/>
                </div>
            </div>
            
        </div>
    )
}