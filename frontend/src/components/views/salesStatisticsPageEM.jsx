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

import { CSVLink } from "react-csv"; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { EMNavigation } from "../emNavigation";
import { PageTitle } from "../section-components/pageTitle";
import axios from 'axios'; // Import Axios for making HTTP requests
import "./../../App.css";

const key = 'Composed Table';

export const SalesStatisticsPageEM = () => {
    
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
            const response = await axios.get('http://localhost:4567/view_sales_statistics');
            console.log('Response from server:', response.data); // Log the response data
            setData({nodes: response.data}); // Set the events state
            // console.log(events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    const generateCSV = () => {

        if (data.nodes.length === 0) {
            console.error('No data to export.');
            return [];
        }
    
        const csvData = [];
        data.nodes.forEach(item => {
            csvData.push({
                'Event ID': item.eventID,
                'Event Name': item.eventName,
                'Venue': item.venue,
                'Date & Time': item.dateTime,
                'Total no. of tickets': item.numTotalTickets,
                'No. of Tickets Sold': item.numTicketsSold,
                'Event Revenue': "$" + item.revenueEarned,
                'No. of attendees': item.numAttendees
            });
        });
    
        return csvData;
    };

    // Convert string to array buffer
    const s2ab = (s)=> {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    const generateXlsx = () => {

        if (data.nodes.length === 0) {
            console.error('No data to export.');
            return [];
        }
    
        const csvData = [];
        data.nodes.forEach(item => {
            csvData.push([
                item.eventID,
                item.eventName,
                item.venue,
                item.dateTime,
                item.numTotalTickets,
                item.numTicketsSold,
                "$" + item.revenueEarned,
                item.numAttendees
            ]);
        });

        //create new workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([['Event ID', 'Event Name', 'Venue', 'Date & Time', 'Total no. of tickets', 'No. of Tickets Sold', 'Event Revenue', 'No. of attendees'], ...csvData]);

        //add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        //generate xlsx file
        const wbout  = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        //save the file
        saveAs(blob, 'events_report.xlsx');
    };

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
                EVENTDATETIME: (array) => array.sort((a, b) => a.eventDateTime-b.eventDateTime),
                TICKETSOLD: (array) => array.sort((a, b) => a.eventTicketSold - b.eventTicketSold),
                EVENTREVENUE: (array) => array.sort((a, b) => (a.eventRevenue - b.eventRevenue)),
            },
        }
        );
        
        function onSortChange(action, state) {
            console.log(action, state);
        }
    
        //handle cancel event
        const [serverResponse, setServerResponse] = useState("");

        const cancelEvent = (eventID) => {
            cancelSelectedEvent(eventID);
            setServerResponse(""); // Clear serverResponse state
            setTimeout(() => {  window.location.reload(); }, 1000);
        };

        async function cancelSelectedEvent(eventID) {
            try {
                const response = await axios.delete('http://localhost:4567/delete_event/' + eventID);
                console.log('Response from server:', response.data); // Log the response data
                setServerResponse(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        }
        
        return (
            <div>
            <EMNavigation/>

            <PageTitle pageTitle={"Sales Statistics"} pageView="" filterShow={"false"} />
            
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
                    <div className="col">
                        <h5 className={serverResponse!=="Event deleted successfully." ? "text-danger" : "text-success"}>{serverResponse}</h5>
                    </div>
                    <div className="col p-3 d-flex justify-content-end">
                        <button type="button" className="btn btn-primary" onClick={generateXlsx}>Generate Report (XLSX) </button>
                    </div>
                    <div className="col p-3 d-flex justify-content-end">
                        <CSVLink data={generateCSV()} filename={"events_report.csv"} className="btn btn-primary">
                            Generate report (CSV)
                        </CSVLink>
                    </div>
                </div>

                <div className="mt-5">
                    {data.nodes.length>0 ?
                    (<Table data={data} theme={theme}  sort={sort}>
                        {(tableList) => (
                            <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCellSort sortKey="EVENTID">Event ID</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTNAME">Event Name</HeaderCellSort>
                                    <HeaderCellSort sortKey="TICKETSOLD">No. of tickets sold</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTREVENUE">Event revenue</HeaderCellSort>
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
                                    <Cell>{item.eventName}</Cell>
                                    <Cell>{item.numTicketsSold}</Cell>
                                    <Cell>${item.revenueEarned}</Cell>
                                    <Cell><Button variant="danger" onClick={()=>cancelEvent(item.eventID)}>Cancel Event</Button></Cell>
                                </Row>
                                )): "Loading..."}
                            </Body>
                            </>
                        )}
                    </Table>) : "No events found"
                    }
                </div>
            </div>
        </div>
    )
};