"use client";

import Time from "@/components/Time";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Circle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 6;

  const PlayersTable = [
    { UserId: "#12345", Email: "abc@gmail.com", Status: "Online" },
    { UserId: "#12346", Email: "xyz@gmail.com", Status: "Offline" },
    { UserId: "#12347", Email: "lmn@gmail.com", Status: "Online" },
    { UserId: "#12348", Email: "pqr@gmail.com", Status: "Offline" },
    { UserId: "#12349", Email: "stu@gmail.com", Status: "Online" },
    { UserId: "#12350", Email: "vwx@gmail.com", Status: "Online" },
    { UserId: "#12351", Email: "ghi@gmail.com", Status: "Offline" },
    { UserId: "#12352", Email: "jkl@gmail.com", Status: "Online" },
  ];

  useEffect(() => {
    const onlinePlayerCount = PlayersTable.filter(
      (player) => player.Status === "Online"
    ).length;
    setCount(onlinePlayerCount);
  }, []);

  const filteredPlayers = PlayersTable.filter((player) =>
    player.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPlayers.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="ml-4 p-10">
      <Time />
      <div className="w-[1485px] pt-10">
        <div className="flex pb-10">
          <h1 className="text-4xl font-medium">Manage Players</h1>
          <h1 className="text-xs font-medium self-end pl-10 flex pr-2">
            Currently Active
          </h1>
          <Circle className="mb-[2px] self-end stroke-[#00FF11] w-[6.67px] h-[6.67px] border-[#00FF11] rounded-full bg-[#00FF11] mr-2" />
          <span className="self-end text-xs font-medium">{count}</span>
        </div>
        <div className="flex items-center w-[469px] h-[40px] align-middle border-b-2 border-b-[#CCCCCC]">
          <Search className="w-[12px] has-[12px] ml-4 mr-2" />
          <Input
            className="border-none focus:border-none text-sm font-medium outline-none"
            placeholder="Search for player"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table className="table-auto w-full">
          <TableHeader>
            <TableRow className="text-[#EB3D77]">
              <TableHead className="w-1/3 text-[#EB3D77]">UserID</TableHead>
              <TableHead className="w-1/3 text-[#EB3D77]">Email</TableHead>
              <TableHead className="w-1/3 text-[#EB3D77]">Status</TableHead>
              <TableHead className="w-1/3 text-[#EB3D77]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((player) => (
              <TableRow key={player.UserId}>
                <TableCell className="font-medium">{player.UserId}</TableCell>
                <TableCell>{player.Email}</TableCell>
                <TableCell
                  className={`${
                    player.Status === "Online"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {player.Status}
                </TableCell>
                <TableCell>
                  <Button className="w-[150px] h-[40px] bg-[#EB3D77] hover:bg-[#f597b6] hover:text-white">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={1} className="text-center pt-[40px]">
                <Button
                  className="border-2 border-grey mr-[40px] w-[150px] h-[40px] bg-white text-black hover:bg-gray-200"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  className="border-2 border-grey w-[150px] h-[40px] bg-white text-black hover:bg-gray-200"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
