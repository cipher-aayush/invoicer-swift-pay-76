
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useInvoice } from "@/contexts/InvoiceContext";
import { v4 as uuidv4 } from "uuid";

// Sample Indian client data
const sampleIndianClients = [
  {
    id: uuidv4(),
    name: "Rajesh Sharma",
    email: "rajesh@tataenterprises.com",
    address: "42, Nariman Point, Mumbai, Maharashtra 400021",
    phone: "9876543210",
    company: "Tata Enterprises"
  },
  {
    id: uuidv4(),
    name: "Priya Patel",
    email: "priya@reliancegroup.in",
    address: "Reliance Corporate Park, Ghansoli, Navi Mumbai 400701",
    phone: "8765432109",
    company: "Reliance Group"
  },
  {
    id: uuidv4(),
    name: "Vikram Singh",
    email: "vikram@infosys.com",
    address: "Electronics City, Hosur Road, Bangalore 560100",
    phone: "7654321098",
    company: "Infosys Technologies"
  },
  {
    id: uuidv4(),
    name: "Ananya Desai",
    email: "ananya@wipro.com",
    address: "Doddakannelli, Sarjapur Road, Bangalore 560035",
    phone: "6543210987",
    company: "Wipro Ltd"
  },
  {
    id: uuidv4(),
    name: "Suresh Reddy",
    email: "suresh@mahindra.com",
    address: "Gateway Building, Apollo Bunder, Mumbai 400001",
    phone: "5432109876",
    company: "Mahindra & Mahindra"
  },
  {
    id: uuidv4(),
    name: "Neha Verma",
    email: "neha@techmahindra.com",
    address: "Plot 1, Phase III, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057",
    phone: "9876123450",
    company: "Tech Mahindra"
  },
  {
    id: uuidv4(),
    name: "Ramesh Joshi",
    email: "ramesh@hcltech.com",
    address: "806, Siddharth, 96, Nehru Place, New Delhi 110019",
    phone: "8765123490",
    company: "HCL Technologies"
  },
  {
    id: uuidv4(),
    name: "Meena Gupta",
    email: "meena@adanigroup.com",
    address: "Adani House, Near Mithakhali Circle, Navrangpura, Ahmedabad 380009",
    phone: "7654123890",
    company: "Adani Group"
  },
  {
    id: uuidv4(),
    name: "Kiran Kumar",
    email: "kiran@ltimindtree.com",
    address: "L&T Business Park, TC 2 Building, Powai, Mumbai 400072",
    phone: "6543123780",
    company: "LTIMindtree"
  },
  {
    id: uuidv4(),
    name: "Deepa Nair",
    email: "deepa@hindustanunilever.com",
    address: "Unilever House, B. D. Sawant Marg, Chakala, Andheri (E), Mumbai 400099",
    phone: "5432123670",
    company: "Hindustan Unilever"
  },
  {
    id: uuidv4(),
    name: "Anil Kapoor",
    email: "anil@maruti.co.in",
    address: "Nelson Mandela Road, Vasant Kunj, New Delhi 110070",
    phone: "9876987650",
    company: "Maruti Suzuki"
  },
  {
    id: uuidv4(),
    name: "Shalini Tiwari",
    email: "shalini@hdfcbank.com",
    address: "HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    phone: "8765876540",
    company: "HDFC Bank"
  },
  {
    id: uuidv4(),
    name: "Prakash Mishra",
    email: "prakash@iocl.com",
    address: "IndianOil Bhavan, 1, Sri Aurobindo Marg, Yusuf Sarai, New Delhi 110016",
    phone: "7654765430",
    company: "Indian Oil Corporation"
  },
  {
    id: uuidv4(),
    name: "Ritu Malik",
    email: "ritu@airtel.com",
    address: "Bharti Crescent, 1, Nelson Mandela Road, Vasant Kunj, New Delhi 110070",
    phone: "6543654320",
    company: "Bharti Airtel"
  },
  {
    id: uuidv4(),
    name: "Aayush Kumar",
    email: "aayushstudy25@gmail.com",
    address: "B-7, PENTHOUSE , ROOM NO -25 ,GREEN VALLEY , SMIRITI NAGAR BHILAI 490020",
    phone: "09155023899",
    company: "Software Technology Parks of India (STPI) Bhilai CG"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createClient } = useInvoice();
  
  useEffect(() => {
    if (user) {
      // Add sample clients if needed
      const addSampleClients = async () => {
        try {
          for (const client of sampleIndianClients) {
            await createClient({
              name: client.name,
              email: client.email,
              address: client.address,
              phone: client.phone,
              company: client.company
            });
          }
          console.log("Added sample Indian clients");
        } catch (error) {
          console.error("Error adding sample clients:", error);
        }
      };
      
      // Uncomment the line below to add sample clients when needed
      // addSampleClients();
      
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);
  
  return null; // This component only handles navigation
};

export default Index;
