import image from "../../assets/online-event.png"
import "../HomeGuest/HomeGuest.css"
import groupImage from "../../assets/EmptyGroups.svg"
import eventImage from "../../assets/EmptyEvents.svg"
import handsUp from "../../assets/handsUp.svg"
import { NavLink } from "react-router-dom"



export default function HomeGuest() {

    return (
        <div className="home-main-div">
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
                        <img src={image} alt="intro" className="intro-image" />
                    </div>
                </div>
            </div>
            <div className="middle-div">
                <div><h2>How Meetup works</h2></div>
                <div>Meet new people who share your interests through online and in-person events. It’s free to create an account.</div>
            </div>
            <div className="lower-div">
                {/* <div className="home-guest-lower-div"> */}
                    <div className="guest-group">
                        <div><img src={handsUp} /></div>
                        <div className="bottom-link"><NavLink to="/allGroups" className="bottom-link"><h3>Find a group</h3></NavLink></div>
                        <div className="content-text"> Do what you love, meet others who love it, find your community. The rest is history!</div>
                    </div>
                    <div className="guest-event">
                        <div><img src={eventImage} /></div>
                        <div className="bottom-link"><NavLink to="/allEvents" className="bottom-link"><h3>Find an event</h3></NavLink></div>
                        <div className="content-text">Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</div>
                    </div>
                    {/* <div className="guest-start-group">
                        <div><img src={groupImage} /></div>
                        <div className="bottom-link"><NavLink to="/signup" className="bottom-link"><h3>Start a group</h3></NavLink></div>
                        <div className="content-text">You don’t have to be an expert to gather people together and explore shared interests.</div>
                    </div> */}
                </div>
            {/* </div> */}
        </div>
    )
}