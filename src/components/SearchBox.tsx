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
import { CurrentWeatherData, Location } from "@/utils/type";
import { Skeleton } from "./ui/skeleton";

export function SearchBox({
	selectedLocation,
	weather,
}: {
	selectedLocation: (cord: string) => void;
	weather?: CurrentWeatherData;
}) {
	const [open, setOpen] = useState(false);
	const [location, setLocation] = useState<Location[]>([]);
	const [value, setValue] = useState<string>();
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
		if (weather?.city && !search) {
			setValue(weather.city);
			setLocation([
				{
					label: weather.city,
					value: Math.random(), // Still not ideal, better use weather.id if available
				},
			]);
		}
	}, [weather]);

	useEffect(() => {
		if (search && search.length > 0) {
			const timeoutId = setTimeout(() => {
				SearchLocation(search!);
			}, 1000);
			return () => clearTimeout(timeoutId);
		}
	}, [search]);

	return !weather ? (
		<Skeleton className="w-full h-8" />
	) : (
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
