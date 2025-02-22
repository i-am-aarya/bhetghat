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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 6;

  const PlayersTable = [
    { username: "#12345", email: "abc@gmail.com", status: "Online" },
    { username: "#12346", email: "xyz@gmail.com", status: "Offline" },
    { username: "#12347", email: "lmn@gmail.com", status: "Online" },
    { username: "#12348", email: "pqr@gmail.com", status: "Offline" },
    { username: "#12349", email: "stu@gmail.com", status: "Online" },
    { username: "#12350", email: "vwx@gmail.com", status: "Online" },
    { username: "#12351", email: "ghi@gmail.com", status: "Offline" },
    { username: "#12352", email: "jkl@gmail.com", status: "Online" },
  ];

  useEffect(() => {
    const onlinePlayerCount = PlayersTable.filter(
      (player) => player.status === "Online",
    ).length;
    setCount(onlinePlayerCount);
  }, []);

  const filteredPlayers = PlayersTable.filter((player) =>
    player.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPlayers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPlayers.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="ml-4 p-10">
      {/* <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <div className="flex gap-2">
        <SidebarTrigger />
        <Time />
      </div>
      <div className="w-[1485px] pt-10">
        <div className="flex pb-10">
          <h1 className="text-4xl font-medium">Manage Players</h1>
          <h1 className="text-xs font-medium self-end pl-10 flex pr-2">
            Currently Active
          </h1>
          <Circle className="mb-[2px] self-end stroke-[#00FF11] w-[6.67px] h-[6.67px] border-[#00FF11] rounded-full bg-[#00FF11] mr-2" />
          <span className="self-end text-xs font-medium">{count}</span>
        </div>
        {/* <div className="flex items-center mt-8 w-[469px] h-[40px] align-middle border-b-2 border-b-[#CCCCCC]"> */}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 ml-4 mr-2 absolute top-2 left-0 text-gray-500" />
          </div>
          <Input
            className="text-sm font-medium pl-10"
            placeholder="Search for player"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* </div> */}
        <Table className="table-auto w-full mt-20 ">
          <TableHeader>
            <TableRow className="text-[#EB3D77]">
              <TableHead className="w-1/3 text-[#EB3D77]">Username</TableHead>
              <TableHead className="w-1/3 text-[#EB3D77]">Email</TableHead>
              <TableHead className="w-1/3 text-[#EB3D77]">Status</TableHead>
              <TableHead className="w-1/3 text-[#EB3D77]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((player, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{player.username}</TableCell>
                <TableCell>{player.email}</TableCell>
                <TableCell
                  className={`${
                    player.status === "Online"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {player.status}
                </TableCell>
                {/* <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-[150px] h-[40px] bg-[#EB3D77] hover:bg-[#f597b6] hover:text-white">
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-[#EB3D77] text-white hover:bg-[#f597b6]">
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-white hover:bg-none">
            <TableRow>
              <TableCell colSpan={1} className="text-center pt-[40px]">
                {/* <Button
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
                </Button> */}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
