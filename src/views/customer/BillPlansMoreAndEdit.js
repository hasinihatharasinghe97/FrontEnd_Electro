import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from 'react-router-dom'
import Axios from 'axios';
import CalculateBillForm from "./CalculateBillForm";
import { Paper, makeStyles } from "@material-ui/core";
import UseTable from "../../components/Customer/useTable";
import * as DeviceBill from "./DeviceBill";
import SearchBar from "material-ui-search-bar";
import { TableBody } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import "../../assets/css/Customer/billCalculate.css";
import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Popup from "../../components/Customer/bill_control/Popup";
import { DeleteOutline } from "@material-ui/icons";
import { EditOutlined } from "@material-ui/icons";
import Notification from "../../components/Customer/bill_control/Notification";
import ConfirmDialog from "../../components/Customer/bill_control/ConfirmDialog";
import { Link } from "react-router-dom";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link_ from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';



const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "appliance", label: "Appliance" },
  { id: "quantity", label: "Quantity" },
  { id: "power", label: "Power" },
  { id: "priority", label: "Priority" },
  { id: "hPeak", label: "Peak Hour" },
  { id: "hOffPeak", label: "Off Peak Hour" },
  { id: "hDay", label: "Day Hour" },
  { id: "action", label: "Actions" },
];



var token = document.cookie
  .split(';')
  .map(cookie => cookie.split('='))
  .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {}).token;


var ParamsUserId = document.cookie
  .split(';')
  .map(cookie => cookie.split('='))
  .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {}).userId;

console.log("Front End eken yanawada id eka :- " + ParamsUserId);



export default function BillPlansMoreAndEdit() {

  const params = new URLSearchParams(window.location.search)
  const newBillId  = params.get('bill_id');
  console.log(params.get('bill_id'));

  const classes = useStyles();
  let history = useHistory();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [buttonState, setButtonState] = useState(true);
//   const [newBillId, setNewBillId] = useState(0);
const [searched,setSearched] = useState("");
  const[searchRecords,setSearchRecords] = useState([]);

const [records, setRecords] = useState([]);

 
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });



  const [openPopup, setOpenPopup] = useState(false);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    variant: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const { TblContainer, TblHead, TblPagination, /*recordsAfterPagingAndSorting*/ } =
    UseTable(records, headCells, filterFn);

    const requestSearch =  (searchVal) =>{
      console.log("The searsearchVal",searchVal);
      
      const filteredRows =  searchRecords.filter((row) =>{
        console.log(records);
        return row.appliance.toLowerCase().includes(searchVal.toLowerCase());
      });
      console.log("The filter Row",filteredRows);
      
      if(searchVal == " "){
        setRecords(records);
      }else{
        setRecords(filteredRows);
      }
      
    }
  
    const cancelSearch = () =>{
      setSearched("");
      requestSearch(searched);
    };
  
  

  useEffect(async () => {

    
    const recordDetails = await DeviceBill.getAllDevices(newBillId);
    if (recordDetails == null) {
      setRecords([]);
      setButtonState(true);
      setSearchRecords([]);
    } else {
      setRecords(recordDetails);
      setButtonState(false);
      setSearchRecords(recordDetails);
    }


    console.log("inside of useEffect", recordDetails);


  }, []);
  // const [pagingAndSortingData, setRecordsPaging] = useState([]);

  const handleSearch = async (e) => {
    let target = e.target;
    await setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.appliance.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const addOrEdit = async (device, resetForm) => {
    if (device.device_id == 0) {
      await DeviceBill.insertDevice(device);
    } else {
      await DeviceBill.updateDevice(device);
    }

    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    const recordDetails = await DeviceBill.getAllDevices(newBillId);
    if (recordDetails == null) {
      setRecords([]);
      setButtonState(true);
      setSearchRecords([]);
    } else {
      setRecords(recordDetails);
      setButtonState(false);
      setSearchRecords(recordDetails);
    }
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      variant: "success",
    });
  };

  const openInPopup = (item) => {
    console.log(item.device_id);
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDeletedevice = async (device_id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    await DeviceBill.Deletedevice(device_id, newBillId);
    const recordDetails = await DeviceBill.getAllDevices(newBillId);
    if (recordDetails == null) {
      setRecords([]);
      setButtonState(true);
      setSearchRecords([]);
    } else {
      setRecords(recordDetails);
      setButtonState(false);
      setSearchRecords([]);
    }
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      variant: "danger",
    });
  };



  /**
  * function of delete all cookies
//   */
  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  async function calculateDevice() {

    var token = document.cookie
      .split(';')
      .map(cookie => cookie.split('='))
      .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {}).token;


    var ParamsUserId = document.cookie
      .split(';')
      .map(cookie => cookie.split('='))
      .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {}).userId;



    const response = await Axios.post(`${process.env.REACT_APP_BASE_URL}/update-main-bill-plan/${ParamsUserId}`, {

      bill_id: newBillId
    }, {
      headers: {
        authorization: `Token ${token}`
      }
    })
    // console.log(response.data);
    if (response.data.status) {
      // setCalculatedData(response.data.data)


    } else {
      console.log(response.data.message);
      history.push("/sign-in");
      window.location.reload();//reload browser
      deleteAllCookies();//delete all cookies
    }

  }



  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" style={{marginTop: '2rem',marginLeft: '2rem'}} separator={<NavigateNextIcon fontSize="small" />}>
        <Link_ underline="hover" color="blue" href="/my-bill-plans">
          My Bill Plans
        </Link_ >
        <Typography color="text.primary">Edit Bill Plan</Typography>
      </Breadcrumbs>

      <Paper className={classes.pageContent}>
        <h2>Your Device Data</h2>
        <Toolbar>
        <SearchBar
           value={searched}
           onChange={(searchVal) => requestSearch(searchVal)}
           onCancelSearch={() => cancelSearch()}
            />
          <button
            type="button"
            className="btn btn-info add-new-button"
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          >
            <Add />
            New Appliance
          </button>
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>

            {records.map((item) => (
              <TableRow key={item.device_id}>
                <TableCell>{item.appliance}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.power}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>
                  {item.hPeak}hrs : {item.mPeak} min
                </TableCell>
                <TableCell>
                  {item.hOffPeak}hrs : {item.mOffPeak} min
                </TableCell>
                <TableCell>
                  {item.hDay}hrs : {item.mDay} min
                </TableCell>
                <TableCell>
                  <button
                    className="btn editActionButtonIcon"
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlined
                      fontSize="small"
                      ClassName={classes.actionButtonIcon}
                    />
                  </button>
                  <button
                    className="btn deleteActionButtonIcon"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are You sure delete this record",
                        subTitle: "You can't  undo this operation",
                        btnStatus: "danger",
                        onConfirm: () => {
                          onDeletedevice(item.device_id);
                        },
                      });
                    }}
                  >
                    <DeleteOutline
                      fontSize="small"
                      ClassName={classes.actionButtonIcon}
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        {/* <TblPagination /> */}


        <Link to={
          `/bill-comparison?bill_id=${newBillId}`
        }>

          <button type="button" className="btn btn-success calculate-button" onClick={calculateDevice} disabled={buttonState}>
            Calculate
          </button>
        </Link>
      </Paper>
      <Popup
        title="Add New Device Details"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CalculateBillForm
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          billId={newBillId}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}
