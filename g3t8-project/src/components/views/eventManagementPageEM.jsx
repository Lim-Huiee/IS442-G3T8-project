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

import { StaffNavigation } from "../staffNavigation";
import { PageTitle } from "../section-components/pageTitle";
import { EventModal } from "../section-components/eventModal";
import "./../../App.css";

const key = 'Composed Table';

export const EventManagementPageEM = () => {
    
    //check userRole
    
    //search bar
    const [search, setSearch] = useState("");
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };
    
    //dummy data - to be called from backend
    const dataList = [
        {
            eventID: '1',
            eventType: 'Concert',
            eventName: 'Kyuhyun',
            eventVenue: 'Singapore Expo Hall 7',
            eventDateTime: '2024-03-30 12:00',
            eventTicketPrice: '$100.00',
            numTicketAvail: '1000',
        },
        {
            eventID: '2',
            eventType: 'Concert',
            eventName: 'Ed Sherran',
            eventVenue: 'National Stadium',
            eventDateTime: '2024-02-16 12:00',
            eventTicketPrice: '$200.00',
            numTicketAvail: '2000',
        }
    ]
    
    //table set up
    const [data, setData] = useState({nodes: dataList});
    
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
                EVENTID: (array) => array.sort((a, b) => a.eventID.localeCompare(b.eventID)),
                EVENTNAME: (array) => array.sort((a, b) => a.eventName.localeCompare(b.eventName)),
                EVENTVENUE: (array) => array.sort((a, b) => a.eventVenue.localeCompare(b.eventVenue)),
                EVENTDATETIME: (array) => array.sort((a, b) => a.eventDateTime-b.eventDateTime),
                EVENTTICKETPRICE: (array) => array.sort((a, b) => a.eventTicketPrice - b.eventTicketPrice),
                NUMTICKETAVAIL: (array) => array.sort((a, b) => (a.numTicketAvail - b.numTicketAvail)),
            },
        }
        );
        
        function onSortChange(action, state) {
            console.log(action, state);
        }
    
        //handle create/update modal
        const [toShowModal, setToShowModal] = useState(false);
        const [action, setAction] = useState("");
        const handleClose = () => {
            setToShowModal(false);
        }
        const handleOpen = (selectedAction) => {
            setToShowModal(true);
            setAction(selectedAction);
        }
        
        return (
            <div>
            <StaffNavigation/>

            <PageTitle pageTitle={"Event Management"} pageView="" filterShow={"false"} />
            
            <div class="container mt-5">
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
                        <Button variant="primary" onClick={() => handleOpen("Create")}>Add Event</Button>
                    </div>
                </div>

                <div className="mt-5">
                    <Table data={data} theme={theme}  sort={sort}>
                        {(tableList) => (
                            <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCellSort sortKey="EVENTID">Event ID</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTTYPE">Event Type</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTNAME">Event Name</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTVENUE">Event Venue</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTDATETIME">Event Date & Time</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTTICKETPRICE">Ticket Price</HeaderCellSort>
                                    <HeaderCellSort sortKey="NUMTICKETAVAIL">Available tickets</HeaderCellSort>
                                    <HeaderCell>Action</HeaderCell>
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
                                    <Cell>{item.eventVenue}</Cell>
                                    <Cell>{item.eventDateTime}</Cell>
                                    <Cell>{item.eventTicketPrice}</Cell>
                                    <Cell>{item.numTicketAvail}</Cell>
                                    <Cell><Button variant="primary">Update Event</Button></Cell>
                                </Row>
                                )): "Loading..."}
                            </Body>
                            </>
                        )}
                    </Table>
                </div>
            </div>
            <EventModal show={toShowModal} action={action} handleClose={handleClose}/>
        </div>
    )
};