import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { createTheme as createMaterialTheme } from "@mui/material/styles";
import { ThemeProvider as MaterialThemeProvider } from "@mui/material/styles";
// import Button from "@mui/material/Button";

import {Table,Header,HeaderRow,Body,Row,HeaderCell,Cell} from '@table-library/react-table-library/table';
import {useSort,HeaderCellSort,SortIconPositions,SortToggleType} from "@table-library/react-table-library/sort";
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

import { EMNavigation } from "../emNavigation";
import { PageTitle } from "../section-components/pageTitle";
import { EventModal } from "../section-components/eventModal";
import axios from 'axios'; // Import Axios for making HTTP requests
import "./../../App.css";

const key = 'Composed Table';

export const EventManagementPageEM = () => {
    
    //check userRole
    
    //search bar
    const [search, setSearch] = useState("");
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };
    
    //table set up
    const [data, setData] = useState({nodes: [{}]});

    //table data
    useEffect(() => {
        fetchEvents();
    }, []); // Empty dependency array to run only once when the component mounts

    async function fetchEvents() {
        try {
            const response = await axios.get('http://localhost:4567/get_all_events');
            console.log('Response from server:', response.data); // Log the response data
            setData({nodes: response.data}); // Set the events state
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    const resize = { resizerHighlight: "#dde2eb", resizerWidth: 25 };
    const theme = useTheme(getTheme());
    
    //table sorting
    const sort = useSort(
        data,
        {
            state: {
                sortKey: "EVENTID",
                reverse: true,
            },
            onChange: onSortChange,
        },
        {
            sortFns: {
                EVENTID: (array) => array.sort((a, b) => a.eventID - b.eventID),
                EVENTNAME: (array) => array.sort((a, b) => a.eventName.localeCompare(b.eventName)),
                EVENTVENUE: (array) => array.sort((a, b) => a.venue.localeCompare(b.venue)),
                EVENTDATETIME: (array) => array.sort((a, b) => a.eventDateTime-b.eventDateTime),
                EVENTTICKETPRICE: (array) => array.sort((a, b) => a.ticketPrice - b.ticketPrice),
                NUMTICKETAVAIL: (array) => array.sort((a, b) => (a.numTicketsAvailable - b.numTicketsAvailable)),
            },
        }
        );
        
        function onSortChange(action, state) {
            console.log(action, state);
        }
    
        //handle create/update modal
        const [toShowModal, setToShowModal] = useState(false);
        const [action, setAction] = useState("");
        const [isLoading, setIsLoading] = useState(true);

        const [eventData, setEventData] = useState({});
        const handleClose = () => {
            createEventDataField();
            setToShowModal(false);
        }
        const handleOpen = (selectedAction, eventID) => {
            setAction(selectedAction);
            if (selectedAction!="Create") { //view and update both need to retrieve from DB
                fetchEventToUpdate(eventID);
                setToShowModal(true);
                setIsLoading(true);
            } else {
                createEventDataField();
                setToShowModal(true);
            }
        }

        function createEventDataField() {
            setEventData({
                eventType: "",
                eventName: "",
                venue: "",
                eventDateTime: "",
                numTotalTickets: "",
                numTicketsAvailable: "",
                eventDetails: "",
                ticketPrice: "",
                cancellationFee: ""
            })
            setIsLoading(false);
        }

        async function fetchEventToUpdate(id) {
            try {
                const response = await axios.get('http://localhost:4567/get_event_by_id/' + id);
                console.log('Response from server:', response.data); // Log the response data
                                
                setEventData({
                    eventID: response.data.eventID,
                    eventType: response.data.eventType,
                    eventName: response.data.eventName,
                    venue: response.data.venue,
                    eventDateTime: response.data.eventDateTime,
                    numTotalTickets: response.data.numTotalTickets,
                    numTicketsAvailable: response.data.numTicketsAvailable,
                    eventDetails: response.data.eventDetails,
                    ticketPrice: response.data.ticketPrice.toFixed(2),
                    cancellationFee: response.data.cancellationFee.toFixed(2)
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                alert(error);
            }
        }

        function processDateTime(datetime) {
            const inputDate = new Date(datetime);

            // Get the individual components of the date
            const year = inputDate.getFullYear();
            const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
            const day = String(inputDate.getDate()).padStart(2, '0');
            const hours = String(inputDate.getHours() % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
            const minutes = String(inputDate.getMinutes()).padStart(2, '0');
            const ampm = inputDate.getHours() >= 12 ? 'PM' : 'AM';

            // Construct the formatted date string
            const formattedDateString = `${year}/${month}/${day} ${hours}.${minutes}${ampm}`;

            return formattedDateString; // Output: "2024/03/30 11.40AM"
        }
        
        return (
            <div>
            <EMNavigation/>

            <PageTitle pageTitle={"Event Management"} pageView="" filterShow={"false"} />
            
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-left h-100">
                            <div className="searchbar">
                            <input className="search_input" type="text" name="" placeholder="Search event name" value={search} onChange={handleSearch}/>
                            <a href="#" className="search_icon">🔍</a>
                            </div>
                        </div>
                    </div>

                    <div className="col p-3 d-flex justify-content-end">
                        <Button variant="primary" onClick={() => handleOpen("Create", null)}>Add Event</Button>
                    </div>
                </div>
                
                <div className="mt-5">
                    <Table data={data} theme={theme}  sort={sort}>
                        {(tableList) => (
                            <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCellSort sortKey="EVENTID" resize>Event ID</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTTYPE" resize>Event Type</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTNAME" resize>Event Name</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTVENUE" resize>Event Venue</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTDATETIME" resize>Event Date & Time</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTTICKETPRICE" resize>Ticket Price</HeaderCellSort>
                                    <HeaderCellSort sortKey="NUMTICKETAVAIL" resize>Available tickets</HeaderCellSort>
                                    <HeaderCell resize>View</HeaderCell>
                                    <HeaderCell resize>Update</HeaderCell>
                                </HeaderRow>
                            </Header>

                            <Body>
                                {tableList.length > 0 ?
                                tableList.filter((el) => {
                                    if (search.length>0) {
                                        return el.eventName.toLowerCase().includes(search.toLowerCase());
                                    } else {
                                        return true
                                    }
                                }).map((item) => (
                                <Row key={item.eventID} item={item}>
                                    <Cell>{item.eventID}</Cell>
                                    <Cell>{item.eventType}</Cell>
                                    <Cell>{item.eventName}</Cell>
                                    <Cell>{item.venue}</Cell>
                                    <Cell>{processDateTime(item.eventDateTime)}</Cell>
                                    <Cell>{item.ticketPrice}</Cell>
                                    <Cell>{item.numTicketsAvailable}</Cell>
                                    <Cell>
                                        <Button variant="primary" onClick={() => handleOpen("View", item.eventID)}>View</Button>
                                    </Cell>
                                    <Cell>
                                        <Button variant="warning" onClick={() => handleOpen("Update", item.eventID)}>Update</Button>
                                    </Cell>
                                </Row>
                                )): "Loading..."}
                            </Body>
                            </>
                        )}
                    </Table>
                </div>
            </div>
            <div>
            {isLoading ? (
                <p></p>
            ) : (
                <EventModal show={toShowModal} action={action} handleClose={handleClose} data={eventData} processDateTime={processDateTime}/>
            )}
            </div>
        </div>
    )
};