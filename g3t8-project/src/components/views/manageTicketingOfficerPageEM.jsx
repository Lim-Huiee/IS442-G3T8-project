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
import { TicketingOfficerModal } from "../section-components/ticketingOfficerModal";
import axios from 'axios'; // Import Axios for making HTTP requests
import "./../../App.css";

const key = 'Composed Table';

export const ManageTicketingOfficerPageEM = () => {
    
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
        fetchTicketingOfficers();
    }, []); // Empty dependency array to run only once when the component mounts

    async function fetchTicketingOfficers() {
        try {
            const response = await axios.get('http://localhost:4567/get_users_by_role/' + 'ticketing officer');
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
                sortKey: "OFFICERID",
                reverse: true,
            },
            onChange: onSortChange,
        },
        {
            sortFns: {
                OFFICERID: (array) => array.sort((a, b) => a.eventID - b.eventID),
                EMAIL: (array) => array.sort((a, b) => a.eventName.localeCompare(b.eventName)),
                NAME: (array) => array.sort((a, b) => a.venue.localeCompare(b.venue)),
            },
        }
        );
        
        function onSortChange(action, state) {
            console.log(action, state);
        }
    
        //handle create/update modal ---- CHANGE HERE
        const [toShowModal, setToShowModal] = useState(false);
        const [action, setAction] = useState("");
        const [isLoading, setIsLoading] = useState(true);

        const [eventData, setEventData] = useState({});
        const handleClose = () => {
            window.location.reload();
            setToShowModal(false);
        }
        const handleOpen = (selectedAction, userID) => {
            setAction(selectedAction);
            if (selectedAction!="Create") { //view and update both need to retrieve from DB
                fetchTicketingOfficerToUpdate(userID);
                setToShowModal(true);
                setIsLoading(true);
            } else {
                createTicketingOfficerDataField();
                setToShowModal(true);
            }
        }

        function createTicketingOfficerDataField() {
            setEventData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            })
            setIsLoading(false);
        }

        async function fetchTicketingOfficerToUpdate(id) {
            try {
                const response = await axios.get('http://localhost:4567/get_user_by_id/' + id);
                console.log('Response from server:', response.data); // Log the response data
                                
                setEventData({
                    userID: response.data.userID,
                    name: response.data.name,
                    email: response.data.email,
                    password: response.data.password,
                    confirmPassword: ""
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        }
        
        return (
            <div>
            <StaffNavigation/>

            <PageTitle pageTitle={"Manage Ticketing Officers"} pageView="" filterShow={"false"} />
            
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-left h-100">
                            <div className="searchbar">
                            <input className="search_input" type="text" name="" placeholder="Search ticketing officer's name" value={search} onChange={handleSearch}/>
                            <a href="#" className="search_icon">🔍</a>
                            </div>
                        </div>
                    </div>

                    <div className="col p-3 d-flex justify-content-end">
                        <Button variant="primary" onClick={() => handleOpen("Create", null)}>Add Officers</Button>
                    </div>
                </div>
                
                <div className="mt-5">
                    <Table data={data} theme={theme}  sort={sort}>
                        {(tableList) => (
                            <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCellSort sortKey="OFFICERID" resize>Officer ID</HeaderCellSort>
                                    <HeaderCellSort sortKey="EMAIL" resize>Email</HeaderCellSort>
                                    <HeaderCellSort sortKey="NAME" resize>Name</HeaderCellSort>
                                    <HeaderCellSort sortKey="ROLE" resize>Role</HeaderCellSort>
                                    <HeaderCell resize>View</HeaderCell>
                                    <HeaderCell resize>Update</HeaderCell>
                                </HeaderRow>
                            </Header>

                            <Body>
                                {tableList.length > 0 ?
                                tableList.filter((el) => {
                                    if (search.length>0) {
                                        return el.name.toLowerCase().includes(search.toLowerCase());
                                    } else {
                                        return true
                                    }
                                }).map((item) => (
                                <Row key={item.userID} item={item}>
                                    <Cell>{item.userID}</Cell>
                                    <Cell>{item.email}</Cell>
                                    <Cell>{item.name}</Cell>
                                    <Cell>Ticketing Officer</Cell>
                                    <Cell>
                                        <Button variant="primary" onClick={() => handleOpen("View", item.userID)}>View</Button>
                                    </Cell>
                                    <Cell>
                                        <Button variant="warning" onClick={() => handleOpen("Update", item.userID)}>Update</Button>
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
                <TicketingOfficerModal show={toShowModal} action={action} handleClose={handleClose} data={eventData}/>
            )}
            </div>
        </div>
    )
};