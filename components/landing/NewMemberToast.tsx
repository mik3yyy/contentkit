"use client"

import { useEffect, useRef, useState } from "react"

const MEMBERS = [
  { name: "James T.",   location: "New York, US",    time: "47 seconds ago"  },
  { name: "Maria K.",   location: "London, UK",       time: "20 seconds ago"  },
  { name: "David R.",   location: "Sydney, AU",       time: "2 minutes ago"   },
  { name: "Sofia L.",   location: "Toronto, CA",      time: "1 minute ago"    },
  { name: "Marcus W.",  location: "Dubai, UAE",       time: "34 seconds ago"  },
  { name: "Priya S.",   location: "Singapore",        time: "just now"        },
  { name: "Ben C.",     location: "Los Angeles, US",  time: "1 minute ago"    },
  { name: "Aisha M.",   location: "Lagos, NG",        time: "53 seconds ago"  },
  { name: "Jordan K.",  location: "Chicago, US",      time: "2 minutes ago"   },
  { name: "Hannah C.",  location: "Melbourne, AU",    time: "28 seconds ago"  },
  { name: "Carlos R.",  location: "Madrid, ES",       time: "1 minute ago"    },
  { name: "Emma P.",    location: "Amsterdam, NL",    time: "45 seconds ago"  },
  { name: "Luca B.",    location: "Milan, IT",        time: "1 minute ago"    },
  { name: "Yemi A.",    location: "Accra, GH",        time: "37 seconds ago"  },
  { name: "Noah F.",    location: "Berlin, DE",       time: "2 minutes ago"   },
  { name: "Chloe N.",   location: "Paris, FR",        time: "just now"        },
]

export default function NewMemberToast() {
  const [visible, setVisible] = useState(false)
  const [member, setMember] = useState(MEMBERS[0])
  const t1 = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const t2 = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const pick = () => MEMBERS[Math.floor(Math.random() * MEMBERS.length)]

    const cycle = (delay: number) => {
      t1.current = setTimeout(() => {
        setMember(pick())
        setVisible(true)
        // hide after 5 seconds, then schedule next
        t2.current = setTimeout(() => {
          setVisible(false)
          // next popup: random between 40s and 2 minutes
          cycle(40_000 + Math.random() * 80_000)
        }, 5000)
      }, delay)
    }

    // First popup: 8–15 seconds after page load
    cycle(8_000 + Math.random() * 7_000)

    return () => {
      clearTimeout(t1.current)
      clearTimeout(t2.current)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-6 left-4 sm:left-6 z-50 transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-[#2b2b2b] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl w-[280px] sm:w-[300px] border border-white/5">
        {/* Avatar */}
        <div className="w-10 h-10 bg-[#3d3d3d] rounded-full flex items-center justify-center shrink-0">
          <svg width="18" height="18" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">New Member</span>
          </div>
          <p className="text-[13px] font-semibold text-white leading-tight truncate">{member.name}</p>
          <p className="text-[11px] text-gray-500 leading-tight">
            {member.location}
            <span className="mx-1 text-gray-600">·</span>
            {member.time}
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          className="text-gray-600 hover:text-gray-300 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
