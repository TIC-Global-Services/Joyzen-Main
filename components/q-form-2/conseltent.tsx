'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const MonthNavigator = ({
    currentDate,
    onPrev,
    onNext,
    canGoPrev,
}: {
    currentDate: Date;
    onPrev: () => void;
    onNext: () => void;
    canGoPrev: boolean;
}) => {
    const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
    ];
    return (
        <div className="flex items-center justify-between w-full mb-8 mt-2 px-6">
            <button
                onClick={onPrev}
                disabled={!canGoPrev}
                className={`w-10 h-10 flex items-center justify-center transition-colors ${canGoPrev ? 'text-gray-500 hover:text-gray-800 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="text-base sm:text-lg font-medium tracking-tight text-[#1A1A1A]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={onNext} className="w-11 h-11 rounded-full bg-linear-to-br from-[#f8fdf9] to-[#d6eade] flex items-center justify-center text-[#036132] hover:scale-105 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)] border-[1.5px] border-white cursor-pointer z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
    );
};

const DateCell = ({
    date,
    isAvailable,
    isToday,
    isSelected,
    onClick,
}: {
    date: Date | null;
    isAvailable?: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    onClick?: (d: Date) => void;
}) => {
    if (!date) return <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square" />;

    // Selected state — filled green
    if (isSelected) {
        return (
            <button
                onClick={() => onClick && onClick(date)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 aspect-square flex items-center justify-center rounded-full bg-[#036132] backdrop-blur-xs text-white hover:scale-110 font-sans font-medium text-sm sm:text-base border-[1.5px] border-[#036132] shadow-[0_5px_12px_rgba(3,97,50,0.3)] transition-all cursor-pointer z-10"
            >
                {date.getDate()}
            </button>
        );
    }

    // Today — ring indicator (only when available)
    if (isToday && isAvailable) {
        return (
            <button
                onClick={() => onClick && onClick(date)}
                className="relative w-8 h-8 sm:w-11 sm:h-11 aspect-square flex items-center justify-center rounded-full bg-linear-to-b from-[#f8fdf9] to-[#dceade] text-[#036132] hover:scale-110 font-sans font-medium text-sm sm:text-base border-[1.5px] border-white shadow-[0_5px_12px_rgba(0,0,0,0.08),inset_0_2px_5px_rgba(255,255,255,1)] transition-all backdrop-blur-xs cursor-pointer z-10 ring-2 ring-[#036132]/40"
            >
                {date.getDate()}
            </button>
        );
    }

    // Unavailable — greyed out, not clickable
    if (!isAvailable) {
        return (
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 aspect-square flex items-center justify-center text-gray-400 font-sans font-medium text-sm sm:text-base">
                {date.getDate()}
            </div>
        );
    }

    // Available — default clickable
    return (
        <button
            onClick={() => onClick && onClick(date)}
            className="relative w-8 h-8 sm:w-11 sm:h-11 aspect-square flex items-center justify-center rounded-full bg-linear-to-b from-[#f8fdf9] to-[#dceade] text-[#036132] hover:scale-110 font-sans font-medium text-sm sm:text-base border-[1.5px] border-white shadow-[0_5px_12px_rgba(0,0,0,0.08),inset_0_2px_5px_rgba(255,255,255,1)] transition-all cursor-pointer z-10"
        >
            {date.getDate()}
        </button>
    );
};

const CalendarCard = () => {
    const today = new Date();
    // Midnight-normalized "today" for reliable date-only comparisons
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [currentDate, setCurrentDate] = useState(
        () => new Date(today.getFullYear(), today.getMonth(), 1)
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Prevent navigating before the current month
    const canGoPrev =
        currentDate.getFullYear() > today.getFullYear() ||
        (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() > today.getMonth());

    const handlePrevMonth = () => {
        if (!canGoPrev) return;
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () =>
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Convert Sun=0 based getDay() to Mon=0 index for a Monday-first grid
    const startDay = (firstDayOfMonth + 6) % 7;

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        window.open(`https://calendly.com/joyzen-system/15min?date=${formattedDate}`, '_blank');
    };

    const renderGrid = () => {
        const grid = [];

        for (let i = 0; i < startDay; i++) {
            grid.push(<DateCell key={`empty-${i}`} date={null} />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

            // Timezone-safe past check via normalized timestamps
            const isPast = date.getTime() < todayNormalized.getTime();

            // Today ring only on the exact current date
            const isTodayDate = date.getTime() === todayNormalized.getTime();

            // Weekday-based availability (Mon-Fri, not in the past)
            const isAvailable = !isPast && date.getDay() !== 0 && date.getDay() !== 7;

            const isSelected =
                selectedDate !== null &&
                date.getFullYear() === selectedDate.getFullYear() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getDate() === selectedDate.getDate();

            grid.push(
                <DateCell
                    key={i}
                    date={date}
                    isAvailable={isAvailable}
                    isToday={isTodayDate}
                    isSelected={isSelected}
                    onClick={isAvailable ? handleDateClick : undefined}
                />
            );
        }

        return grid;
    };

    return (
        <div className="w-full md:max-w-xl mx-auto relative group z-20">
            <div className="w-full bg-white/5 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] rounded-[1.5rem] border-[5.29px] border-[#FFFFFF03] p-8 sm:p-10 relative overflow-hidden">

                {/* Joyzen Orange Watermark Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 pointer-events-none z-0 opacity-30 select-none">
                    <Image
                        src="/joyzen-orange.png"
                        alt="Joyzen Orange Watermark"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Title */}
                <h3 className="text-center text-sm sm:text-base font-sans font-medium text-[#1a1a1a] mb-6 pt-2 tracking-wide uppercase relative z-10">
                    Select a Date & Time
                </h3>

                <MonthNavigator
                    currentDate={currentDate}
                    onPrev={handlePrevMonth}
                    onNext={handleNextMonth}
                    canGoPrev={canGoPrev}
                />

                {/* Unified grid — day headers and date cells share the same cell dimensions */}
                <div className="grid grid-cols-7 gap-y-4 gap-x-2 sm:gap-x-3 justify-items-center mb-16 relative z-10 w-full px-1">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
                        <div
                            key={day}
                            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[10px] sm:text-xs font-sans font-medium text-gray-500 tracking-wider"
                        >
                            {day}
                        </div>
                    ))}
                    {renderGrid()}
                </div>

                {/* Powered by Calendly footer */}
                <div className="absolute bottom-6 left-0 right-0 flex items-end justify-center gap-1.5 z-20">
                    <span className="text-xs sm:text-sm font-satoshi font-medium tracking-tight">Powered by</span>
                    <span className="text-[#006BFF] font-sans font-bold text-sm sm:text-2xl tracking-tight flex items-start">
                        Calendly
                    </span>
                </div>
            </div>
        </div>
    );
};

const Consultant = () => {
    return (
        <section className="relative w-full py-20 px-6 sm:px-12 lg:px-24 flex items-center justify-center">

            {/* <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-[#f7f4ed]/30 transform-gpu" style={{ transform: 'translateZ(0)' }}>
                
                <div className="absolute top-0 -left-[10%] w-[50%] h-[60%] bg-[#ffffff] opacity-30 rounded-[100%] md:blur-[120px] md:block hidden" />
                <div className="absolute top-0 -left-[10%] w-full h-[60%] md:hidden block bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)]" />

                <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[40%] bg-[#036132] opacity-90 rounded-[100%] md:blur-[140px] md:block hidden" />
                <div className="absolute -bottom-[20%] -right-[10%] w-full h-[40%] md:hidden block bg-[radial-gradient(circle,rgba(3,97,50,0.7)_0%,transparent_50%)]" />

                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-[#b4def7] opacity-80 rounded-[100%] md:blur-[140px] md:block hidden" />
                <div className="absolute -bottom-[20%] -left-[10%] w-full h-[60%] md:hidden block bg-[radial-gradient(circle,rgba(180,222,247,0.7)_0%,transparent_50%)]" />
            </div> */}
            {/* <div className="absolute bottom-0 z-40 left-0 w-full h-[10%] md:h-[5%] bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" /> */}

            {/* ---------- DESKTOP LAYOUT ---------- */}
            <div className="hidden lg:flex w-full flex-row items-center justify-between gap-20 relative z-10">

                {/* Left Side - Text & Info */}
                <div className="w-1/2 flex flex-col items-start justify-center">
                    <h2 className="text-[3.125rem] font-bold tracking-tighter mb-6 leading-none">
                        Request a Call Back from a Consultant
                    </h2>

                    <p className="text-lg  font-bold leading-[1.2] mb-8 max-w-xl text-[#EF8F60] tracking-tight">
                       We are offering limited pre-launch clarity calls to understand your concerns, explain our upcoming model, help you decide if Joyzen is right for you, and offer early access opportunities.
No selling. Just Clarity.
                    </p>

                    <ul className="flex flex-col gap-4 mb-10">
                        {[
                            "Discuss your current health concerns or symptoms",
                            "Understand your hormonal and fertility health",
                            "Ask questions you've been unsure about",
                            "Get clarity on your next steps, without pressure"
                        ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4 text-black tracking-tighter text-lg  font-medium leading-[1.2]">
                                <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 text-gray-500">
                                    <Image src="/dot_icon.svg" alt="bullet" width={18} height={18} className="object-contain" />
                                </span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side - Custom Calendar UI */}
                <div className="w-1/2 flex justify-end relative items-center z-20">
                    <CalendarCard />
                </div>

            </div>

            {/* ---------- MOBILE LAYOUT ---------- */}
            <div className="flex lg:hidden w-full flex-col relative z-10 max-w-sm mx-auto pb-10">
                <div className="flex justify-center mb-5">
                    <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white/80 border border-white rounded-full shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                        <span className="text-xs font-satoshi font-medium text-[#1a1a1a] mt-1">Book a free call</span>
                    </div>
                </div>

                <h2 className="text-2xl sm:text-[28px] text-center font-sans font-medium tracking-tighter mb-4 uppercase leading-[1.1] text-[#1a1a1a] px-2">
                    TALK TO A CONSULTANT
                </h2>

                <p className="text-sm sm:text-[14px] text-center font-epilogue font-medium leading-[1.35] mb-8 text-[#1a1a1a] px-1">
                    We are offering limited pre-launch clarity calls to understand your concerns, explain our upcoming model, help you decide if Joyzen is right for you, and offer early access opportunities. No selling. Just Clarity.
                </p>

                <ul className="flex flex-col gap-3 mb-10 px-1 sm:px-2">
                    {[
                        "Discuss your current health concerns or symptoms",
                        "Understand your hormonal and fertility health",
                        "Ask questions you've been unsure about",
                        "Get clarity on your next steps, without pressure"
                    ].map((text, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#1a1a1a] tracking-tight text-sm sm:text-[14px] font-epilogue font-medium leading-[1.3] pl-1">
                            <span className="shrink-0 w-[12px] h-[12px] flex items-center justify-center mt-[1px] text-gray-800">
                                <Image src="/dot_icon.svg" alt="bullet" width={18} height={18} className="object-contain" />
                            </span>
                            {text}
                        </li>
                    ))}
                </ul>

                <div className="w-full flex justify-center mb-6 relative z-20">
                    <CalendarCard />
                </div>
            </div>
        </section>
    );
};

export default Consultant;