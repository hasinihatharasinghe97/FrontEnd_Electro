import React from "react";
import "../../assets/css/Admin/admin.css";

export default function AddNewCebEngineer() {
  return (
    <div className="body-manageengineer">
      <form>
        <div className="ceb-heading">
          <h2 align="center">ADD NEW CEB ENGINEER</h2>
        </div>

        <div class="row mb-3">
          <label for="firstname" class="col-sm-2 col-form-label" align="left">
            <b>First Name</b>
          </label>
          <div class="w-50 p-1">
            <input type="text" class="form-control" id="firstname" required />
          </div>
        </div>

        <div class="row mb-3">
          <label for="lastname" class="col-sm-2 col-form-label" align="left">
            <b>Last Name</b>
          </label>
          <div class="w-50 p-1">
            <input type="text" class="form-control" id="lastname" required />
          </div>
        </div>

        <div class="row mb-3">
          <label for="email" class="col-sm-2 col-form-label" align="left">
            <b>Email</b>
          </label>
          <div class="w-50 p-1">
            <input type="email" class="form-control" id="email" required />
          </div>
        </div>

        <div class="row mb-3">
          <label
            for="contactnumber"
            class="col-sm-2 col-form-label"
            align="left"
          >
            <b>Contact Number</b>
          </label>
          <div class="w-50 p-1">
            <input
              type="tel"
              class="form-control"
              id="contactnumber"
              required
            />
          </div>
        </div>

        <div class="row mb-3">
          <label for="address" class="col-sm-2 col-form-label" align="left">
            <b>Address</b>
          </label>
          <div class="w-50 p-1">
            <input type="text" class="form-control" id="address" required />
          </div>
        </div>

        <div class="row mb-3">
          <label for="nicnumber" class="col-sm-2 col-form-label" align="left">
            <b>NIC Number</b>
          </label>
          <div class="w-50 p-1">
            <input type="text" class="form-control" id="nicnumber" required />
          </div>
        </div>

        <div class="row mb-3">
          <label for="image" class="col-sm-2 col-form-label" align="left">
            <b>Image</b>
          </label>
          <div class="w-50 p-1">
            <input
              type="file"
              accept="image/*"
              class="form-control"
              id="fileToUpload"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="admin-add-update-btn">
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}
