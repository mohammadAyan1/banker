// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/axios";

// const QueryRaised = () => {
//   const [notes, setNotes] = useState([]);
//   const [users, setUsers] = useState({});

//   const fetchNotes = async () => {
//     try {
//       const res = await axiosInstance.get("/notes/get");
//       setNotes(res.data);

//       // Fetch users for each note
//       const userIds = [...new Set(res.data.map((note) => note.addedBy))];
//       const userPromises = userIds.map((id) =>
//         axiosInstance.get(`/auth/currentUser/${id}`)
//       );

//       const userResponses = await Promise.all(userPromises);
//       const userMap = {};
//       userResponses.forEach((res, idx) => {
//         userMap[userIds[idx]] = res.data;
//       });
//       setUsers(userMap);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   return (
//     <div>
//       <ul className='space-y-2'>
//         {notes.map((note) => (
//           <li key={note._id} className='p-3 border rounded shadow'>
//             <div className='text-sm text-gray-500'>
//               {note.role} - {new Date(note.createdAt).toLocaleString()}
//             </div>
//             <div>
//               <strong>{users[note.addedBy]?.name || "Unknown User"}</strong>:{" "}
//               {note.message}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default QueryRaised;

// !------------------------

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/axios";
// import DataTable from "react-data-table-component";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCaseById } from "../../../redux/features/case/caseThunks";

// const QueryRaised = () => {
//   const [notes, setNotes] = useState([]);
//   const [users, setUsers] = useState({});
//   const dispatch = useDispatch();

//   const data = useSelector((state) => state.case.currentCase);

//   const fetchNotes = async () => {
//     try {
//       const res = await axiosInstance.get("/notes/get");
//       setNotes(res.data);

//       const userIds = [...new Set(res.data.map((note) => note.addedBy))];
//       const userPromises = userIds.map((id) =>
//         axiosInstance.get(`/auth/currentUser/${id}`)
//       );

//       const userResponses = await Promise.all(userPromises);
//       const userMap = {};
//       userResponses.forEach((res, idx) => {
//         userMap[userIds[idx]] = res.data;
//       });
//       setUsers(userMap);
//     } catch (error) {
//       console.log("Error fetching notes:", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   // Optional: Fetch related case data if needed (once notes are loaded)
//   useEffect(() => {
//     if (notes.length > 0) {
//       // You can loop here or pick specific note(s) to fetch related case
//       notes.forEach((note) => {
//         if (note.caseId) {
//           dispatch(fetchCaseById(note.caseId));
//         }
//       });
//     }
//   }, [notes, dispatch]);

//   const columns = [
//     {
//       name: "Bank Name",
//       selector: (row) => row.bankName || "N/A",
//       sortable: true,
//     },
//     {
//       name: "Customer Name",
//       selector: (row) => row.customerName || "N/A",
//       sortable: true,
//     },
//     {
//       name: "Role",
//       selector: (row) => row.role,
//       sortable: true,
//     },
//     {
//       name: "User",
//       selector: (row) => users[row.addedBy]?.name || "Unknown User",
//       sortable: true,
//     },
//     {
//       name: "Message",
//       selector: (row) => row.message,
//       wrap: true,
//     },
//     {
//       name: "Date",
//       selector: (row) =>
//         new Date(row.createdAt).toLocaleString("en-IN", {
//           dateStyle: "short",
//           timeStyle: "short",
//         }),
//       sortable: true,
//     },
//   ];

//   return (
//     <div className='p-4'>
//       <h2 className='text-xl font-semibold mb-4'>Query Raised</h2>
//       <DataTable
//         columns={columns}
//         data={notes}
//         pagination
//         highlightOnHover
//         striped
//         dense
//       />
//     </div>
//   );
// };

// export default QueryRaised;

// !

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/axios";
import DataTable from "react-data-table-component";

const QueryRaised = () => {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState({});
  const [caseMap, setCaseMap] = useState({}); // Store case data by ID

  // const fetchNotes = async () => {
  //   try {
  //     const res = await axiosInstance.get("/notes/get");
  //     const noteList = res.data;
  //     setNotes(noteList);

  //     // Fetch unique users
  //     const userIds = [...new Set(noteList.map((note) => note.addedBy))];
  //     const userResponses = await Promise.all(
  //       userIds.map((id) => axiosInstance.get(`/auth/currentUser/${id}`))
  //     );
  //     const userMap = {};
  //     userResponses.forEach((res, idx) => {
  //       userMap[userIds[idx]] = res.data;
  //     });
  //     setUsers(userMap);

  //     // Fetch unique cases

  //     const caseIds = [...new Set(noteList.map((note) => note.caseId))];
  //     const caseResponses = await Promise.all(
  //       caseIds.map((id) => axiosInstance.get(`/case/${id}`)) // Adjust API path as needed
  //     );
  //     const caseDataMap = {};
  //     caseResponses.forEach((res, idx) => {
  //       caseDataMap[caseIds[idx]] = res.data;
  //     });
  //     setCaseMap(caseDataMap);
  //   } catch (error) {
  //     console.log("Error fetching data:", error.message);
  //   }
  // };

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes/get");
      const noteList = res.data;
      setNotes(noteList);

      // Fetch unique users
      const userIds = [...new Set(noteList.map((note) => note.addedBy))];
      const userResponses = await Promise.all(
        userIds.map((id) => axiosInstance.get(`/auth/currentUser/${id}`))
      );
      const userMap = {};
      userResponses.forEach((res, idx) => {
        userMap[userIds[idx]] = res.data;
      });
      setUsers(userMap);

      // Validate ObjectId using regex
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

      // Fetch unique and valid caseIds only
      const caseIds = [...new Set(noteList.map((note) => note.caseId))];
      const validCaseIds = caseIds.filter(isValidObjectId);

      const caseResponses = await Promise.all(
        validCaseIds.map((id) => axiosInstance.get(`/case/${id}`))
      );

      const caseDataMap = {};
      caseResponses.forEach((res, idx) => {
        caseDataMap[validCaseIds[idx]] = res.data;
      });
      setCaseMap(caseDataMap);
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const columns = [
    {
      name: "Bank Name",
      selector: (row) => caseMap[row.caseId]?.bankName || "N/A",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => caseMap[row.caseId]?.customerName || "N/A",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role || "N/A",
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => users[row.addedBy]?.name || "Unknown User",
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row.message || "N/A",
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.createdAt).toLocaleString("en-IN", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      sortable: true,
    },
  ];

  // console.log(notes);

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-4'>Query Raised</h2>
      <DataTable
        columns={columns}
        data={notes}
        pagination
        highlightOnHover
        striped
        dense
      />
    </div>
  );
};

export default QueryRaised;
