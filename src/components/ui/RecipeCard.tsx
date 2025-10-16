import React, { useState } from 'react'
import { Button } from './button'
import { Clock, Edit2, Trash2, Users } from 'lucide-react'

export const RecipeCard = ({
    data: initialData
}) => {
    const [data, setData] = useState(()=> initialData)

    return (
        <>
        {data?.map((res)=>{

        
            <div
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
            >
                <div className="bg-muted h-48 flex items-center justify-center text-8xl border-b border-border">
                    😆
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {res.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {res.desc}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{res.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{res.serving}</span>
                        </div>
                        <div className="flex-1" />
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {res.difficulty}
                        </span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border">
                        <Button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                        </Button>
                        <Button className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-colors text-sm">
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
            })}
        </>
    )
}

export default RecipeCard