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
import "./../../App.css";

const key = 'Composed Table';

export const SalesStatisticsPageEM = () => {
    
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
            eventName: 'Test',
            eventDateTime: '12:00',
            eventTicketSold: '10',
            eventRevenue: '$10000'
        },
        {
            eventID: '2',
            eventName: 'Test2',
            eventDateTime: '10:00',
            eventTicketSold: '10',
            eventRevenue: '$10000'
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
                EVENTDATETIME: (array) => array.sort((a, b) => a.eventDateTime-b.eventDateTime),
                TICKETSOLD: (array) => array.sort((a, b) => a.isComplete - b.isComplete),
                EVENTREVENUE: (array) => array.sort((a, b) => (a.eventRevenue - b.eventRevenuee)),
            },
        }
        );
        
        function onSortChange(action, state) {
            console.log(action, state);
        }
    
        //handle cancel event
        const cancelEvent = (eventID) => {
            console.log(eventID);
        };
        
        
        return (
            <div>
            <StaffNavigation/>

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
                </div>

                <div className="mt-5">
                    <Table data={data} theme={theme}  sort={sort}>
                        {(tableList) => (
                            <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCellSort sortKey="EVENTID">Event ID</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTNAME">Event Name</HeaderCellSort>
                                    <HeaderCellSort sortKey="EVENTDATETIME">Event Date & Time</HeaderCellSort>
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
                                    <Cell>{item.eventDateTime}</Cell>
                                    <Cell>{item.eventTicketSold}</Cell>
                                    <Cell>{item.eventRevenue}</Cell>
                                    <Cell><Button variant="danger" onClick={()=>cancelEvent(item.eventID)}>Cancel Event</Button></Cell>
                                </Row>
                                )): "Loading..."}
                            </Body>
                            </>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    )
};