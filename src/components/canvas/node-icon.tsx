import { SiPostgresql, SiMongodb, SiRedis, SiMysql, SiApachecassandra } from "react-icons/si";
import { Server, Database, Activity, Shield, Cog } from "lucide-react";

interface NodeIconProps {
  label: string;
  type: "service" | "database";
  className?: string;
}

export function NodeIcon({ label, type, className = "w-5 h-5" }: NodeIconProps) {
  const normalizedLabel = label.toLowerCase();

  if (type === "database") {
    if (normalizedLabel.includes("postgres")) return <SiPostgresql className={`${className} text-[#4169E1]`} />;
    if (normalizedLabel.includes("mongo")) return <SiMongodb className={`${className} text-[#47A248]`} />;
    if (normalizedLabel.includes("redis")) return <SiRedis className={`${className} text-[#DC382D]`} />;
    if (normalizedLabel.includes("mysql")) return <SiMysql className={`${className} text-[#4479A1]`} />;
    if (normalizedLabel.includes("cassandra")) return <SiApachecassandra className={`${className} text-[#1287B1]`} />;
    return <Database className={className} />;
  }

  // Services
  if (normalizedLabel.includes("gateway") || normalizedLabel.includes("proxy")) return <Server className={className} />;
  if (normalizedLabel.includes("auth")) return <Shield className={className} />;
  if (normalizedLabel.includes("worker") || normalizedLabel.includes("job runner")) return <Cog className={className} />;
  if (normalizedLabel.includes("server")) return <Server className={className} />;
  
  return <Activity className={className} />;
}
