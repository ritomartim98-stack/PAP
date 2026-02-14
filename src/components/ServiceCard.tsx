import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export function ServiceCard({ icon: Icon, title, description, features }: ServiceCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
