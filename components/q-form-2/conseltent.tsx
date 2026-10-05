'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LiquidGlass } from '@liquidglass/react';

interface MonthNavigatorProps {
    currentDate: Date;
    onPrev: () => void;
    onNext: () => void;
    canGoPrev: boolean;
}

const MonthNavigator = ({
    currentDate,
    onPrev,
    onNext,
    canGoPrev,
}: MonthNavigatorProps) => {
    const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
    ];
    return (
        <div className="flex items-center justify-between w-full mb-6 mt-1 px-3 sm:px-6">
            <button
                type="button"
                onClick={onPrev}
                disabled={!canGoPrev}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${canGoPrev ? 'text-zinc-600 hover:text-zinc-900 cursor-pointer' : 'text-zinc-300 cursor-not-allowed'}`}
                aria-label="Previous month"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <div className="text-sm sm:text-base font-semibold tracking-wider text-zinc-900 uppercase">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button
                type="button"
                onClick={onNext}
                className="w-9 h-9 rounded-full bg-linear-to-br from-[#f8fdf9] to-[#d6eade] flex items-center justify-center text-[#036132] hover:scale-105 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white cursor-pointer z-10"
                aria-label="Next month"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
};

interface DateCellProps {
    date: Date | null;
    isAvailable?: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    onClick?: (d: Date) => void;
}

const DateCell = ({
    date,
    isAvailable,
    isToday,
    isSelected,
    onClick,
}: DateCellProps) => {
    if (!date) return <div className="w-9 h-9 sm:w-11 sm:h-11 aspect-square" />;

    // Selected state — filled soft mint disc with dark green text as in Image 1
    if (isSelected) {
        return (
            <button
                type="button"
                onClick={() => onClick && onClick(date)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 aspect-square flex items-center justify-center rounded-full bg-[#E2F0E7] text-[#036132] hover:scale-105 font-sans font-semibold text-sm sm:text-base border border-[#036132]/30 shadow-[0_2px_8px_rgba(3,97,50,0.15)] transition-all cursor-pointer z-10"
            >
                {date.getDate()}
            </button>
        );
    }

    // Today — orange text with orange dot indicator below as in Image 1
    if (isToday) {
        return (
            <button
                type="button"
                onClick={() => onClick && onClick(date)}
                className="relative w-9 h-9 sm:w-11 sm:h-11 aspect-square flex flex-col items-center justify-center text-[#EF8F60] hover:scale-105 font-sans font-semibold text-sm sm:text-base transition-all cursor-pointer z-10"
            >
                <span>{date.getDate()}</span>
                <span className="w-1 h-1 rounded-full bg-[#EF8F60] mt-0.5" />
            </button>
        );
    }

    // Unavailable / past / weekend — subtle greyed out
    if (!isAvailable) {
        return (
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 aspect-square flex items-center justify-center text-zinc-300 font-sans font-medium text-sm sm:text-base select-none">
                {date.getDate()}
            </div>
        );
    }

    // Available — default clickable
    return (
        <button
            type="button"
            onClick={() => onClick && onClick(date)}
            className="relative w-9 h-9 sm:w-11 sm:h-11 aspect-square flex items-center justify-center text-zinc-700 hover:text-[#036132] hover:bg-[#E2F0E7]/60 rounded-full font-sans font-medium text-sm sm:text-base hover:scale-105 transition-all cursor-pointer z-10"
        >
            {date.getDate()}
        </button>
    );
};

export const CalendarCard = ({
    onDateSelect,
}: {
    onDateSelect?: (date: Date) => void;
}) => {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [currentDate, setCurrentDate] = useState(
        () => new Date(today.getFullYear(), today.getMonth(), 1)
    );
    // Default to the 23rd or null
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
        const d = new Date(today.getFullYear(), today.getMonth(), 23);
        return d;
    });

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
        if (onDateSelect) {
            onDateSelect(date);
        }
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

            // Timezone-safe past check
            const isPast = date.getTime() < todayNormalized.getTime();

            // Match Image: if in April 2026, day 22 has the orange indicator, or real today
            const isTodayDate =
                date.getTime() === todayNormalized.getTime() ||
                (currentDate.getFullYear() === 2026 && currentDate.getMonth() === 3 && i === 22);

            // Weekday-based availability (Mon-Fri, not in the past)
            const isAvailable = !isPast && date.getDay() !== 0 && date.getDay() !== 6;

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
        <div className="w-full max-w-lg relative group z-20">
            <div className="w-full bg-white/75 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] rounded-[32px] border border-white/90 p-6 sm:p-8 relative overflow-hidden">
                <MonthNavigator
                    currentDate={currentDate}
                    onPrev={handlePrevMonth}
                    onNext={handleNextMonth}
                    canGoPrev={canGoPrev}
                />

                {/* Day of week headers */}
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center mb-4 relative z-10 w-full px-1">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
                        <div
                            key={day}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                            {day}
                        </div>
                    ))}
                    {renderGrid()}
                </div>

                {/* Powered by Calendly footer */}
                <div className="mt-6 flex items-center justify-center gap-1.5 relative z-10">
                    <span className="text-xs font-normal text-zinc-400">Powered by</span>
                    <span className="text-[#006BFF] font-sans font-bold text-base sm:text-lg tracking-tight">
                        Calendly
                    </span>
                </div>
            </div>
        </div>
    );
};

export interface ConsultantProps {
    onContinueAndSave?: () => void;
    onBack?: () => void;
    showSaveButton?: boolean;
    showBackButton?: boolean;
    saveButtonText?: string;
    onGetInTouch?: () => void;
    onDateSelect?: (date: Date) => void;
    showNotSureCard?: boolean;
    className?: string;
}

export function NotSureCard({
    onGetInTouch,
    useLiquidGlass = false,
    className = "",
}: {
    onGetInTouch?: () => void;
    useLiquidGlass?: boolean;
    className?: string;
}) {
    const cardContent = (
        <div className="p-8 sm:p-12 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mb-8">
                Not Sure What&apos;s Happening?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
                {/* Left Column */}
                <div className="space-y-3">
                    <p className="text-sm sm:text-lg font-semibold leading-relaxed text-zinc-900">
                        <span className="text-[#EF8F60]">That&apos;s okay.</span> We&apos;re here to help.
                    </p>
                    <p className="text-xs sm:text-lg text-black leading-[1.2] font-bold max-w-sm mt-3">
                        If you&apos;re unsure about what you need or have questions before your call, leave us a message and our Clarity team will get in touch.
                    </p>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <ul className="space-y-3.5">
                        {[
                            "Discuss your current health concerns or symptoms",
                            "Understand your hormonal and fertility health",
                            "Ask questions you've been unsure about",
                            "Get clarity on your next steps, without pressure",
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-800 font-medium">
                                <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 text-gray-500">
                                    <Image src="/dot_icon.svg" alt="bullet" width={18} height={18} className="object-contain" />
                                </span>

                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <button
                            type="button"
                            onClick={onGetInTouch}
                            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-900 bg-[#E5F2EE] hover:bg-[#D8EDE7] border border-[#BCE1E5] shadow-xs hover:shadow-sm transition-all cursor-pointer"
                        >
                            GET IN TOUCH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (useLiquidGlass) {
        return (
            <LiquidGlass
                borderRadius={36}
                blur={3}
                contrast={1.12}
                brightness={1.05}
                saturation={1.15}
                shadowIntensity={0.06}
                displacementScale={0.8}
                elasticity={0.4}
                zIndex={10}
                className={`w-full max-w-4xl rounded-[32px] sm:rounded-[36px] bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden ${className}`}
            >
                {cardContent}
            </LiquidGlass>
        );
    }

    return (
        <div className={`w-full max-w-4xl rounded-[32px] sm:rounded-[36px] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.03)] ${className}`}>
            {cardContent}
        </div>
    );
}

const Consultant = ({
    onContinueAndSave,
    onBack,
    showSaveButton = true,
    showBackButton = false,
    saveButtonText = "CONTINUE & SAVE",
    onGetInTouch,
    onDateSelect,
    showNotSureCard = true,
    className = "",
}: ConsultantProps) => {
    return (
        <section className={`relative w-full flex flex-col items-center justify-center ${className}`}>
            {/* 1. Choose a time to connect Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 text-center mb-8">
                Choose a time to connect
            </h2>

            {/* 2. Centered Calendar UI */}
            <div className="w-full flex justify-center mb-20">
                <CalendarCard onDateSelect={onDateSelect} />
            </div>

            {/* 3. Action Buttons (CONTINUE & SAVE) */}
            {/* {showSaveButton && (
                <div className={`w-full max-w-[440px] flex items-center ${showBackButton && onBack ? 'justify-between' : 'justify-end'} pt-3 ${showNotSureCard ? 'mb-10 sm:mb-14' : 'mb-2'} px-1`}>
                    {showBackButton && onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-zinc-700 bg-white/60 border border-white hover:bg-white transition-all cursor-pointer shadow-xs"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            <span>Back</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onContinueAndSave}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-900 bg-[#E5F2EE] hover:bg-[#D8EDE7] border border-[#BCE1E5] shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                        {saveButtonText}
                    </button>
                </div>
            )} */}

            {/* 4. Bottom Wide Card: "Not Sure What's Happening?" */}
            {showNotSureCard && (
                <NotSureCard onGetInTouch={onGetInTouch} />
            )}
        </section>
    );
};

export default Consultant;