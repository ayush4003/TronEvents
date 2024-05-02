import { useEffect, useState } from "react";
import Modal from "react-modal";
import { NextPage } from "next";
import Link from "next/link";
import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useContract, useContractRead } from "@thirdweb-dev/react";

interface EventData {
  imageUrl: any;
  name: string;
  deadline: string;
  eventId: string;
  prizePool: string;
  completed: boolean;
  organizer: string;
}

const EventCard: React.FC<EventData> = ({
  imageUrl,
  name,
  deadline,
  eventId,
  prizePool,
  organizer,
}) => {
  const address = useAddress();
  const { contract } = useContract(
    "0x8B386Edef0750FFFA8d15e514992E919e21dc828"
  );
  const { mutateAsync: closeEvent } = useContractWrite(contract, "closeEvent");

  const [isModalOpen, setModalOpen] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [load, setLoad] = useState(false);
  const handleModalSubmit = async () => {
    // Handle the submission logic here
    console.log("Input 1:", input1);
    console.log("Input 2:", input2);
    setLoad(true);
    const data = await closeEvent({
      args: [eventId, input1, input2],
    });
    setModalOpen(false);
    setLoad(false);
  };

  return (
    <div className="p-6 rounded-lg shadow-lg mb-6 flex items-center bg-slate-800">
      {/* Left side - Image */}
      <div className="flex-shrink-0 mr-6">
        <MediaRenderer
          src={imageUrl}
          height="144px"
          width="144px"
          alt="Event Image"
        />
      </div>

      {/* Middle - Event Details */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Organizer, Deadline, Event ID */}
        <div className="text-center">
          <p className="text-xl text-cyan-100 font-semibold mb-2">{name}</p>
          <div className="flex flex-col text-cyan-100">
            <p>Deadline: {deadline}</p>
            <p>Event ID: {eventId}</p>
          </div>
        </div>
      </div>

      {/* Right side - Prize Pool and Participate button */}
      <div className="flex flex-col items-center">
        <p className="text-3xl text-cyan-100 mb-2">Prize Pool: {prizePool}</p>

        {address == organizer ? (
          <button
            className="bg-purple-400 text-white px-4 py-2 rounded-md"
            onClick={() => setModalOpen(true)}
          >
            Close
          </button>
        ) : (
          <button
            className="bg-purple-400 text-white px-4 py-2 rounded-md"
            onClick={() => {
              address
                ? alert("Successfully registered")
                : alert("Connect Wallet to participate");
            }}
          >
            Participate
          </button>
        )}
      </div>

      {/* Modal for input */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Input Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            backgroundColor: "rgba(220, 220, 220, 0.7)",
            color: "#000000",
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            width: "80%",
            margin: "auto",
          },
        }}
      >
        <h2 className="text-xl mb-4">Input Modal</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="input1">Winner</label>
            <input
              type="text"
              id="input1"
              className="p-2 w-full rounded"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="input2">Runner</label>
            <input
              type="text"
              id="input2"
              className="p-2 w-full rounded"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
          </div>
          {load ? (
            <p className="bg-gray-500 text-white  px-4 rounded-md">
              Please Wait, Closing Event...
            </p>
          ) : (
            <></>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-purple-400 text-white px-4 py-2 rounded-md mr-2"
            onClick={handleModalSubmit}
            disabled={load}
          >
            Close Event
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

const Dashboard: NextPage = () => {
  const { contract } = useContract(
    "0x8B386Edef0750FFFA8d15e514992E919e21dc828"
  );
  const address = useAddress();
  const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);

  const [events, setEvents] = useState<EventData[]>([
    {
      imageUrl:
        "ipfs://QmPR3SdkE1Zg5eeZrnnkMBXQcj48WmkDFRygGQNC4pE2sD/Screenshot%202024-01-30%20at%207.14.31%20PM.png",
      name: "Event Organizer 1",
      deadline: "2024-12-31",
      eventId: "12345",
      prizePool: "$10,000",
      completed: false,
      organizer: "0x00000",
    },
    // Add more events as needed
  ]);

  const [newEventData, setNewEventData] = useState<EventData>({
    imageUrl: null,
    name: "",
    deadline: "",
    eventId: "",
    prizePool: "",
    completed: false,
    organizer: "0x00000",
  });

  const [name, setname] = useState("");
  const [prize, setPrize] = useState("");
  const [deadline, setdeadline] = useState("");
  const [url, seturl] = useState("");

  const openAddEventModal = () => {
    setAddEventModalOpen(true);
  };

  const closeAddEventModal = () => {
    setAddEventModalOpen(false);
  };
  const storage = new ThirdwebStorage({
    clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID, // You can get one from dashboard settings
  });
  const [file, setfile] = useState<any>(null);
  const uploadToIpfs = async () => {
    try {
      // const url = await upload({
      //   data: [file],
      //   options: {
      //     uploadWithGatewayUrl: true,
      //     uploadWithoutDirectory: true,
      //   },
      // });
      const uri = await storage.upload({
        data: [file],
      });

      console.log(uri);
      const data = await storage.downloadJSON(uri);

      if (data) {
        console.log(data.data[0]);
        return data.data[0];
      }
      const url = await storage.resolveScheme(uri);
      console.log(url);
    } catch (error) {
      console.log(error);
    }
  };
  const { mutateAsync: createEvent } = useContractWrite(
    contract,
    "createEvent"
  );
  const { mutateAsync: closeEvent } = useContractWrite(contract, "closeEvent");
  // const call1 = async () => {
  //   try {
  //     const data = await createEvent({
  //       args: ["10000", "10000"],
  //       overrides: { value: "10000" },
  //     });
  //     console.info("contract call successs", data);
  //   } catch (err) {
  //     console.error("contract call failure", err);
  //   }
  // };
  const [load, setLoad] = useState(false);
  const handleAddEvent = async () => {
    setLoad(true);
    const uri = await uploadToIpfs();
    const data = await createEvent({
      args: [name, deadline, prize, uri],
      overrides: { value: prize },
    });

    console.log(data);
    setLoad(false);
    closeAddEventModal();
  };

  //Fetch Data
  const [loaded, setLoaded] = useState(false);
  const { data, isLoading } = useContractRead(contract, "getAllEvents", []);

  useEffect(() => {
    if (!loaded && data !== undefined) {
      const formattedEvents: EventData[] = [];

      for (var i = 0; i < data[0].length; i++) {
        const eventItem: EventData = {
          imageUrl: data[7][i], // Replace with the actual index in your data array
          name: data[1][i], // Replace with the actual index in your data array
          deadline: data[5][i], // Replace with the actual index in your data array
          eventId: Number(data[0][i]).toString(), // Replace with the actual index in your data array
          prizePool: Number(data[3][i]).toString(),
          completed: data[6][i],
          organizer: data[2][i], // Replace with the actual index in your data array
        };
        if (!eventItem.completed) {
          formattedEvents.push(eventItem);
        }
      }

      setEvents(formattedEvents);
      setLoaded(true);
      console.log(data);
    }
  }, [data, loaded]);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        {/* BeraEvents on the left */}
        <Link href="/">
          <p className="text-2xl font-bold text-white">TronEvents</p>
        </Link>

        {/* Add Event button in the center */}
        <button
          // className="bg-purple-400 text-white px-4 py-2 rounded-md"
          onClick={() => {
            !address
              ? alert("Connect wallet to add event")
              : openAddEventModal();
          }}
        >
          Add Event
        </button>

        {/* Connect Wallet on the right */}
        <ConnectWallet />
      </nav>

      {/* Dashboard content */}
      <div className="flex-1 bg-black-100 p-8">
        {/* Event cards */}
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>

      {/* Modal for adding events */}
      <Modal
        isOpen={isAddEventModalOpen}
        onRequestClose={closeAddEventModal}
        contentLabel="Add Event Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            backgroundColor: "rgba(220, 220, 220, 0.7)",
            color: "#000000",
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            width: "80%",
            margin: "auto",
          },
        }}
      >
        <h2 className="text-xl mb-4">Add Event</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="image">Image URL</label>
            <input
              type="file"
              id="image"
              className="p-2 w-full rounded"
              value={newEventData.imageUrl}
              onChange={(e) => {
                if (e.target.files) {
                  setfile(e.target.files[0]);
                }
              }}
            />
          </div>
          <div>
            <label htmlFor="organizer">Name</label>
            <input
              type="text"
              id="organizer"
              className="p-2 w-full rounded"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="deadline">Deadline</label>
            <input
              type="text"
              id="deadline"
              className="p-2 w-full rounded"
              value={deadline}
              onChange={(e) => setdeadline(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="prizePool">Prize Pool</label>
            <input
              type="number"
              id="prizePool"
              className="p-2 w-full rounded"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
            />
          </div>

          {load ? (
            <p className="bg-gray-500 text-white  px-4 rounded-md">
              Please Wait, Creating Event...
            </p>
          ) : (
            <></>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-purple-400 text-white px-4 py-2 rounded-md mr-2"
            onClick={handleAddEvent}
            disabled={load}
          >
            Add Event
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
            onClick={closeAddEventModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
