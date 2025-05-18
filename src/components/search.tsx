import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEventHandler, FormEventHandler } from "react";
import { SearchBox } from "./SearchBox";

interface props {
	location: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	onSubmit: FormEventHandler<HTMLFormElement>;
}

const Search = ({ location, onChange, onSubmit }: props) => {
	return (
		<form className="flex mb-6 space-x-2" onSubmit={onSubmit}>
			{/* <SearchBox /> */}
			{/* <Input
				type="text"
				placeholder="Masukkan nama kota..."
				value={location}
				onChange={onChange}
				className="flex-1 p-2 rounded-l border border-gray-300 focus:outline-none"
			/> */}
			<Button type="submit">Cari</Button>
		</form>
	);
};

export default Search;
