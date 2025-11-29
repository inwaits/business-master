import { useState } from 'react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { Search } from 'lucide-react'

export default function FindTutor() {
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    city: '',
  })

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Find a Tutor</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Subject"
              placeholder="Select subject"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            />
            <Input
              label="Grade"
              placeholder="Select grade"
              value={filters.grade}
              onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            />
            <Input
              label="City"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search Tutors
            </Button>
            <Button variant="outline">Request Auto-Match</Button>
          </div>
        </CardBody>
      </Card>

      {/* Results */}
      <div className="text-center py-12">
        <p className="text-gray-600">Enter search criteria to find tutors</p>
      </div>
    </div>
  )
}

