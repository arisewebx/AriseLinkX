// src/components/admin/UserStatsCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserStatsCard = ({ stat, index }) => {
  return (
    <Card 
      className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-wide">
            {stat.title}
          </CardTitle>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-3xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-gray-400">{stat.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;