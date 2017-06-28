import React from "react";

const App = React.createClass({
    render() {
        return (
            <table>
                <thead> 
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr>
                        <td>12345</td>
                        <td>Truck 1</td>
                        <td>Truck</td>
                        <td>Vehicle</td>
                    </tr>
                </tbody>
            </table>
        );
    }
});

export {App};