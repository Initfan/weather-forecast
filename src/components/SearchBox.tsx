"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Location } from "@/utils/type";
import { Skeleton } from "./ui/skeleton";

const DEFAULT_LOCATION = [
	{
		label: "Indonesia, Jakarta",
		value: 3026315,
		lat: -6.21,
		lon: 106.85,
	},
];

export function SearchBox({
	selectedLocation,
}: {
	selectedLocation: (cord: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("Indonesia, Jakarta");
	const [location, setLocation] = useState<Location[]>(DEFAULT_LOCATION);
	const [search, setSearch] = useState<string>();
	const [loading, setLoading] = useState(false);

	const SearchLocation = async (value: string) => {
		setLoading(true);
		try {
			const req = await fetch("api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					location: value,
				}),
			});
			const res = await req.json();
			setLocation(
				res.map((v: any) => ({
					label: `${v.country}, ${v.name}`,
					value: v.id,
					lat: v.lat,
					lon: v.lon,
				}))
			);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		if (search && search.length > 0) {
			const timeoutId = setTimeout(() => {
				SearchLocation(search!);
			}, 1000);
			return () => clearTimeout(timeoutId);
		}
	}, [search]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value
						? location.find((loc) => loc.label === value)?.label
						: "Pilih kota..."}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput
						placeholder="Cari kota..."
						className="h-9"
						onValueChange={(v) => setSearch(v)}
					/>
					<CommandList>
						{loading && <Skeleton className="flex-1 h-4 m-2" />}
						{!loading && (
							<CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
						)}
						<CommandGroup>
							{location.map((loc) => (
								<CommandItem
									key={loc.value}
									value={loc.label}
									onSelect={() => {
										selectedLocation(
											`${loc.lat},${loc.lon}`
										);
										setValue(loc.label);
									}}
								>
									{loc.label}
									<Check
										className={cn(
											"ml-auto",
											value === loc.label
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
